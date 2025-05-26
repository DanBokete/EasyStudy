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
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { SessionAuthGuard } from 'src/auth/auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @UseGuards(SessionAuthGuard)
  @Post()
  create(
    @Body() createTaskDto: CreateTaskDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.tasksService.create(createTaskDto, userId);
  }

  @UseGuards(SessionAuthGuard)
  @Get()
  findAll(@Session() session: Record<string, any>) {
    const userId = session.userId as string;
    return this.tasksService.findAll(userId);
  }

  @UseGuards(SessionAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @UseGuards(SessionAuthGuard)
  @Patch(':id')
  update(
    @Param('id') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.tasksService.update(userId, updateTaskDto, taskId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
