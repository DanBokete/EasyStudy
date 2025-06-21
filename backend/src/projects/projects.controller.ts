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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { getUserCredentials } from 'src/auth/utils';

@UseGuards(JwtAuthGuard)
@Controller('v1/projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    const user = getUserCredentials(req);
    return this.projectsService.create(createProjectDto, user.userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = getUserCredentials(req);
    return this.projectsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    const user = getUserCredentials(req);
    return this.projectsService.update(
      user.userId,
      updateProjectDto,
      projectId,
    );
  }

  @Delete(':id')
  remove(@Param('id') projectId: string, @Req() req: Request) {
    const user = getUserCredentials(req);
    return this.projectsService.remove(user.userId, projectId);
  }
}
