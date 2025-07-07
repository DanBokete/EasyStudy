import { Module } from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { PrismaService } from 'src/prisma.service';
import { ProjectsService } from 'src/projects/projects.service';
import { XpService } from 'src/xp/xp.service';

@Module({
  controllers: [SubjectsController],
  providers: [SubjectsService, PrismaService, ProjectsService, XpService],
})
export class SubjectModule {}
