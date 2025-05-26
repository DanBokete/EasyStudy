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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SessionAuthGuard } from 'src/auth/auth.guard';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(SessionAuthGuard)
  @Post()
  create(
    @Body() createProjectDto: CreateProjectDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.projectsService.create(createProjectDto, userId);
  }

  @UseGuards(SessionAuthGuard)
  @Get()
  findAll(@Session() session: Record<string, any>) {
    const userId = session.userId as string;
    return this.projectsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(SessionAuthGuard)
  @Patch(':id')
  update(
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.projectsService.update(userId, updateProjectDto, projectId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}
