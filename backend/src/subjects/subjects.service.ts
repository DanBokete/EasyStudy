import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { updateSubjectDto } from './dto/update-subject.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}
  create(CreateSubjectDto: CreateSubjectDto, userId: string) {
    return this.prisma.subject.create({
      data: { ...CreateSubjectDto, userId },
      include: { Grade: true },
    });
  }

  findAll(userId: string) {
    return this.prisma.subject.findMany({
      where: { userId },
      include: { Grade: true },
    });
  }

  findOne(userId: string, subjectId: string) {
    return this.prisma.subject.findUniqueOrThrow({
      where: { userId, id: subjectId },
      include: { Grade: true },
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateSubjectDto: updateSubjectDto) {
    return `This action updates a #${id} module`;
  }

  remove(userId: string, subjectId: string) {
    return this.prisma.subject.delete({
      where: { userId, id: subjectId },
      include: { Grade: true },
    });
  }

  async getOverview(subjectId: string, userId: string) {
    const subject = await this.prisma.subject.findFirst({
      where: { userId, id: subjectId },
      include: {
        projects: { where: { dueDate: { gte: new Date() } } },
        Grade: true,
      },
    });

    if (!subject) {
      throw new ForbiddenException('You cannot access this information');
    }

    const overview = {
      subjectName: subject.name,
      subjectDescription: subject.description,
      subjectId: subject.id,
      upcomingProjects: subject.projects,
      grades: subject.Grade,
    };

    return overview;
  }
}
