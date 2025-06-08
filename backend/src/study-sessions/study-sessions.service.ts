import { Injectable } from '@nestjs/common';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StudySessionsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudySessionDto: CreateStudySessionDto, userId: string) {
    console.log({ createStudySessionDto, userId });

    const studySession = await this.prisma.studySession.create({
      data: { ...createStudySessionDto, userId },
    });

    return studySession;
  }

  async findAll(userId: string) {
    const studySessions = await this.prisma.studySession.findMany({
      where: { userId },
    });
    return studySessions;
  }

  async findOne(userId: string, studySessionId: string) {
    const studySession = await this.prisma.studySession.findUnique({
      where: { userId, id: studySessionId },
    });
    return studySession;
  }

  async update(
    userId: string,
    updateStudySessionDto: UpdateStudySessionDto,
    studySessionId: string,
  ) {
    const studySession = await this.prisma.studySession.update({
      where: { userId, id: studySessionId },
      data: updateStudySessionDto,
    });
    return studySession;
  }

  async remove(userId: string, studySessionId: string) {
    return await this.prisma.studySession.delete({
      where: { userId, id: studySessionId },
    });
  }
}
