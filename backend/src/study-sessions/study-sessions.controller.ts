import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { StudySessionsService } from './study-sessions.service';
import { CreateStudySessionDto } from './dto/create-study-session.dto';
import { UpdateStudySessionDto } from './dto/update-study-session.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('study-sessions')
export class StudySessionsController {
  constructor(private readonly studySessionsService: StudySessionsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createStudySessionDto: CreateStudySessionDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: string; username: string };
    return this.studySessionsService.create(createStudySessionDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.studySessionsService.findAll(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') studySessionsId: string, @Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.studySessionsService.findOne(user.userId, studySessionsId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') studySessionId: string,
    @Body() updateStudySessionDto: UpdateStudySessionDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: string; username: string };
    return this.studySessionsService.update(
      user.userId,
      updateStudySessionDto,
      studySessionId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') studySessionId: string, @Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.studySessionsService.remove(user.userId, studySessionId);
  }
}
