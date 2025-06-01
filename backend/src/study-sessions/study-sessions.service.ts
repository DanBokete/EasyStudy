import { Injectable } from '@nestjs/common';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class StudySessionsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudySessionDto: CreateStudySessionDto, userId: string) {
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

  findOne(userId: string, studySessionId: string) {
    return `This action returns a #${userId} studySession`;
  }

  update(userId: string, updateStudySessionDto: UpdateStudySessionDto) {
    return `This action updates a #${userId} studySession`;
  }

  remove(userId: string) {
    return `This action removes a #${userId} studySession`;
  }
}
