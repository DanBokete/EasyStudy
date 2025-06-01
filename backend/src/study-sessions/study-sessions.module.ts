import { Module } from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { StudySessionsController } from './study-sessions.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [StudySessionsController],
  providers: [StudySessionsService, PrismaService],
})
export class StudySessionsModule {}
