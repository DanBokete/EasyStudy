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
  BadRequestException,
  Query,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UpdateGradeDto } from './dto/update-grade.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('v1/grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  @Post()
  create(@Body() createGradeDto: CreateGradeDto, @Req() req: Request) {
    if (!req.user) throw new BadRequestException();
    const user = req.user;
    return this.gradesService.create(createGradeDto, user.userId);
  }

  @Get()
  findAll(@Req() req: Request, @Query('moduleId') moduleId: string) {
    if (!req.user) throw new BadRequestException();
    const user = req.user;

    if (moduleId) return this.gradesService.findByModule(moduleId, user.userId);

    return this.gradesService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException();
    const user = req.user;
    return this.gradesService.findOne(id, user.userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGradeDto: UpdateGradeDto,
    @Req() req: Request,
  ) {
    if (!req.user) throw new BadRequestException();
    const user = req.user;
    return this.gradesService.update(id, updateGradeDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: Request) {
    if (!req.user) throw new BadRequestException();
    const user = req.user;
    return this.gradesService.remove(id, user.userId);
  }
}
