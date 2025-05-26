import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}
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

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
