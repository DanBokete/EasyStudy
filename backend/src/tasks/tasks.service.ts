import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';
import { XpService } from 'src/xp/xp.service';
import { log } from 'console';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private xpService: XpService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string) {
    await this.prisma.project.findUniqueOrThrow({
      where: {
        id: createTaskDto.projectId,
        userId,
      },
    });

    return await this.prisma.task.create({
      data: {
        ...createTaskDto,
      },
    });
  }

  findAll(userId: string) {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  async update(userId: string, updateTaskDto: UpdateTaskDto, taskId: string) {
    return await this.prisma.task.update({
      data: { ...updateTaskDto },
      where: { id: taskId, project: { userId } },
    });
  }

  async updateMany(userId: string, updateTaskDto: UpdateTaskDto[]) {
    const taskIds = updateTaskDto.map((task) => task.id);

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    const prevTasks = await this.prisma.task.findMany({
      where: { id: { in: taskIds } },
    });

    if (!user) throw new BadRequestException('user not found');

    // Ensure the tasks belong to the user
    const validTasks = await this.prisma.task.findMany({
      where: {
        id: { in: taskIds },
        project: { userId },
      },
    });

    const validTaskIds = new Set(
      validTasks.map((task) => {
        return task.id;
      }),
    );

    const updates = updateTaskDto
      .filter((task) => validTaskIds.has(task.id))
      .map((task) => {
        const { id, ...taskWithoutId } = task;
        return this.prisma.task.update({
          data: { ...taskWithoutId },
          where: { id },
        });
      });

    const updatedTasks = await this.prisma.$transaction(updates);

    const updateMap = new Map(prevTasks.map((task) => [task.id, task]));

    const newlyCompletedTasks = updatedTasks.filter((task) => {
      const originalTask = updateMap.get(task.id);
      return (
        originalTask &&
        originalTask.status !== task.status &&
        task.status === 'DONE'
      );
    });

    const xp = await this.xpService.applyXP(user, {
      type: 'task',
      count: newlyCompletedTasks.length,
    });
    log(`updated tasks dto: ${JSON.stringify(updateTaskDto)}\n`);
    log(`updated tasks: ${JSON.stringify(updatedTasks)}\n`);
    log(`update map: ${JSON.stringify(updateMap)}\n`);
    log(`newly completed tasks: ${JSON.stringify(newlyCompletedTasks)}\n`);
    log('xp: ' + xp);

    return updatedTasks;
  }

  remove(userId: string, taskId: string) {
    return this.prisma.task.delete({
      where: { id: taskId, project: { userId } },
    });
  }
}
