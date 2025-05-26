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

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.tasksService.create(user.userId, createTaskDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    console.log(user);

    return this.tasksService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') taskId: string, @Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.tasksService.findOne(user.userId, taskId);
  }

  @Patch(':id')
  update(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: string; username: string };
    return this.tasksService.update(taskId, updateTaskDto, user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
