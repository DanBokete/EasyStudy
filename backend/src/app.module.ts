import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { ModulesModule } from './modules/modules.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { GradesModule } from './grades/grades.module';

@Module({
  imports: [
    TasksModule,
    AuthModule,
    ProjectsModule,
    StudySessionsModule,
    ModulesModule,
    ScheduleModule.forRoot(),
    GradesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
