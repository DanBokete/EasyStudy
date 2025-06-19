import { Module } from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { StudySessionsController } from './study-sessions.controller';
import { PrismaService } from 'src/prisma.service';
import { XpService } from 'src/xp/xp.service';

@Module({
  controllers: [StudySessionsController],
  providers: [StudySessionsService, PrismaService, XpService],
})
export class StudySessionsModule {}
