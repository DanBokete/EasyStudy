import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma.service';
import { XpService } from 'src/xp/xp.service';
import { log } from 'console';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private xpService: XpService,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const project = await this.prisma.project.create({
      data: { ...createProjectDto, userId },
    });
    return project;
  }

  async findAll(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId },
      include: { tasks: { orderBy: { dueDate: 'asc' } } },
    });

    // projects.map((project) => {
    //   const tasks = project.tasks.map((task) => {
    //     return formatTasks();
    //   });
    //   return { ...project, tasks };
    // });
    return projects;
  }

  findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { tasks: true },
    });
  }

  async update(
    userId: string,
    updateProjectDto: UpdateProjectDto,
    projectId: string,
  ) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    if (updateProjectDto.status && updateProjectDto.status === 'ARCHIVED') {
      const xp = await this.xpService.applyXP(user, {
        type: 'project',
        size: 'small',
      });
      log('xp: ' + xp);
    }
    return await this.prisma.project.update({
      data: { ...updateProjectDto },
      where: { userId, id: projectId },
      include: { tasks: true },
    });
  }

  async remove(userId: string, projectId: string) {
    const [, deletedProject] = await this.prisma.$transaction([
      this.prisma.task.deleteMany({
        where: { projectId },
      }),
      this.prisma.project.delete({
        where: { userId, id: projectId },
      }),
    ]);
    return deletedProject;
  }
}
