import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Session,
} from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';
import { SessionAuthGuard } from 'src/auth/auth.guard';

@Controller('study-sessions')
export class StudySessionsController {
  constructor(private readonly studySessionsService: StudySessionsService) {}

  @UseGuards(SessionAuthGuard)
  @Post()
  create(
    @Body() createStudySessionDto: CreateStudySessionDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.studySessionsService.create(createStudySessionDto, userId);
  }

  @UseGuards(SessionAuthGuard)
  @Get()
  findAll(@Session() session: Record<string, any>) {
    const userId = session.userId as string;
    return this.studySessionsService.findAll(userId);
  }

  @UseGuards(SessionAuthGuard)
  @Get(':id')
  findOne(
    @Param('id') studySessionsId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.studySessionsService.findOne(userId, studySessionsId);
  }

  @UseGuards(SessionAuthGuard)
  @Patch(':id')
  update(
    @Param('id') studySessionId: string,
    @Body() updateStudySessionDto: UpdateStudySessionDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.studySessionsService.update(
      userId,
      updateStudySessionDto,
      studySessionId,
    );
  }

  @Delete(':id')
  remove(
    @Param('id') studySessionId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.studySessionsService.remove(userId, studySessionId);
  }
}
