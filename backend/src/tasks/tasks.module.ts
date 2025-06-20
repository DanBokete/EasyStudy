import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { PrismaService } from 'src/prisma.service';
import { XpService } from 'src/xp/xp.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, XpService],
})
export class TasksModule {}
