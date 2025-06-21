import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { PrismaService } from 'src/prisma.service';
import { XpService } from 'src/xp/xp.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, XpService],
})
export class ProjectsModule {}
