import { Injectable } from '@nestjs/common';
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
    });
  }

  findOne(userId: string, moduleId: string) {
    return this.prisma.module.findUnique({ where: { userId, id: moduleId } });
  }

  update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  remove(userId: string, moduleId: string) {
    return this.prisma.module.delete({
      where: { userId, id: moduleId },
    });
  }
}
