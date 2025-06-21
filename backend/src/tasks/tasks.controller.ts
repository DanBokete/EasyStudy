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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { getUserCredentials } from 'src/auth/utils';

@UseGuards(JwtAuthGuard)
@Controller('v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const user = getUserCredentials(req);
    return this.tasksService.create(createTaskDto, user.userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = getUserCredentials(req);
    return this.tasksService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }
  @Patch('bulk')
  updateMany(@Body() updateTaskDto: UpdateTaskDto[], @Req() req: Request) {
    const user = getUserCredentials(req);

    return this.tasksService.updateMany(user.userId, updateTaskDto);
  }

  @Patch(':id')
  update(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const user = getUserCredentials(req);
    return this.tasksService.update(user.userId, updateTaskDto, taskId);
  }

  @Delete(':id')
  remove(@Param('id') taskId: string, @Req() req: Request) {
    const user = getUserCredentials(req);
    return this.tasksService.remove(user.userId, taskId);
  }
}
