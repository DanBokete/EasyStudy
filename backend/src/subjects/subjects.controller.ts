import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Session,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { updateSubjectDto } from './dto/update-subject.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { Module } from './entities/module.entity';
import { plainToInstance } from 'class-transformer';
import { getUserCredentials } from 'src/auth/utils';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('v1/subjects')
export class SubjectsController {
  constructor(private readonly SubjectsService: SubjectsService) {}

  @Post()
  async create(
    @Body() CreateSubjectDto: CreateSubjectDto,
    @Req() req: Request,
  ) {
    const user = getUserCredentials(req);
    const module = await this.SubjectsService.create(
      CreateSubjectDto,
      user.userId,
    );
    return new Module(module);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = getUserCredentials(req);
    return plainToInstance(
      Module,
      await this.SubjectsService.findAll(user.userId),
    );
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = getUserCredentials(req);
    const module = await this.SubjectsService.findOne(user.userId, id);
    return new Module(module);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubjectDto: updateSubjectDto) {
    return this.SubjectsService.update(+id, updateSubjectDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') subjectId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return await this.SubjectsService.remove(userId, subjectId);
  }
}
