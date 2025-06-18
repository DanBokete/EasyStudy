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

  // getAverageGrade(grade: Grade) {
  //   return
  // }

  async findAll(userId: string) {
    const grades = await this.prisma.grade.findMany({ where: { userId } });

    return grades;
  }

  async findOne(gradeId: string, userId: string) {
    const grade = await this.prisma.grade.findUniqueOrThrow({
      where: { userId, id: gradeId },
    });

    return grade;
  }

  async findByModule(moduleId: string, userId: string) {
    return await this.prisma.grade.findMany({ where: { userId, moduleId } });
  }

  async update(
    gradeId: string,
    updateGradeDto: UpdateGradeDto,
    userId: string,
  ) {
    return await this.prisma.grade.update({
      data: updateGradeDto,
      where: { id: gradeId, userId },
    });
  }

  async remove(gradeId: string, userId: string) {
    return await this.prisma.grade.delete({
      where: { id: gradeId, userId },
    });
  }
}
