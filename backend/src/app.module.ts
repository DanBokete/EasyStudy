import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { StudySessionsModule } from './study-sessions/study-sessions.module';
import { ModulesModule } from './modules/modules.module';

@Module({
  imports: [TasksModule, AuthModule, ProjectsModule, StudySessionsModule, ModulesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
