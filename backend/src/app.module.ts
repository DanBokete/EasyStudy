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
import { XpModule } from './xp/xp.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { TokenModule } from './token/token.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    TasksModule,
    AuthModule,
    ProjectsModule,
    StudySessionsModule,
    ModulesModule,
    ScheduleModule.forRoot(),
    GradesModule,
    XpModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
