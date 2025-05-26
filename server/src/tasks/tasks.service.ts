import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createTaskDto: CreateTaskDto) {
    return await this.prisma.task.create({
      data: { ...createTaskDto, userId },
    });
  }

  async findAll(userId: string) {
    return await this.prisma.task.findMany({ where: { userId } });
  }

  async findOne(userId: string, taskId: string) {
    return await this.prisma.task.findUnique({ where: { id: taskId, userId } });
  }

  async update(taskId: string, updateTaskDto: UpdateTaskDto, userId: string) {
    return await this.prisma.task.update({
      where: { id: taskId, userId },
      data: updateTaskDto,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
