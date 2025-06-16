import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const project = await this.prisma.project.create({
      data: { ...createProjectDto, userId },
    });
    return project;
  }

  async findAll(userId: string) {
    const projects = await this.prisma.project.findMany({
      where: { userId, archived: false },
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
      where: { id, archived: false },
      include: { tasks: true },
    });
  }

  async update(
    userId: string,
    updateProjectDto: UpdateProjectDto,
    projectId: string,
  ) {
    return await this.prisma.project.update({
      data: { ...updateProjectDto },
      where: { userId, id: projectId },
      include: { tasks: true },
    });
  }

  async remove(userId: string, projectId: string) {
    return await this.prisma.project.update({
      data: { archived: true, archivedAt: new Date() },
      where: { userId, id: projectId },
    });
  }
}
