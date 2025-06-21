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
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { Grade } from './entities/grade.entity';
import { plainToInstance } from 'class-transformer';
import { getUserCredentials } from 'src/auth/utils';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('v1/grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  async create(@Body() createGradeDto: CreateGradeDto, @Req() req: Request) {
    const user = getUserCredentials(req);
    const grade = await this.gradesService.create(createGradeDto, user.userId);

    return new Grade(grade);
  }

  @Get()
  async findAll(@Req() req: Request, @Query('moduleId') moduleId: string) {
    const user = getUserCredentials(req);

    if (moduleId) {
      return plainToInstance(
        Grade,
        await this.gradesService.findByModule(moduleId, user.userId),
      );
    }

    return plainToInstance(
      Grade,
      await this.gradesService.findAll(user.userId),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const user = getUserCredentials(req);
    const grade = await this.gradesService.findOne(id, user.userId);

    return new Grade(grade);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
    @Req() req: Request,
  ) {
    const user = getUserCredentials(req);
    const grade = await this.gradesService.update(
      id,
      updateGradeDto,
      user.userId,
    );
    return new Grade(grade);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    const user = getUserCredentials(req);
    const grade = await this.gradesService.remove(id, user.userId);
    return new Grade(grade);
  }
}
