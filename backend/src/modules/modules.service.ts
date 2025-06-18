import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}
  async create(createModuleDto: CreateModuleDto, userId: string) {
    return this.prisma.module.create({ data: { ...createModuleDto, userId } });
  }

  findAll(userId: string) {
    return this.prisma.module.findMany({
      where: { userId },
      include: { Grade: true },
    });
  }

  findOne(userId: string, moduleId: string) {
    return this.prisma.module.findUniqueOrThrow({
      where: { userId, id: moduleId },
      include: { Grade: true },
    });
  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  remove(userId: string, moduleId: string) {
    return this.prisma.module.delete({
      where: { userId, id: moduleId },
      include: { Grade: true },
    });
  }
}
