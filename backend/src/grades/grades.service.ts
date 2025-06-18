import { Injectable } from '@nestjs/common';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}
  create(createGradeDto: CreateGradeDto, userId: string) {
    return this.prisma.grade.create({ data: { ...createGradeDto, userId } });
  }

  findAll(userId: string) {
    return this.prisma.grade.findMany({ where: { userId } });
  }

  findOne(gradeId: string, userId: string) {
    return this.prisma.grade.findUnique({ where: { userId, id: gradeId } });
  }

  findByModule(moduleId: string, userId: string) {
    return this.prisma.grade.findMany({ where: { userId, moduleId } });
  }

  update(gradeId: string, updateGradeDto: UpdateGradeDto, userId: string) {
    return this.prisma.grade.update({
      data: updateGradeDto,
      where: { id: gradeId, userId },
    });
  }

  remove(gradeId: string, userId: string) {
    return this.prisma.grade.delete({
      where: { id: gradeId, userId },
    });
  }
}
