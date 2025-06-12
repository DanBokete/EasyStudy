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
  Req,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { SessionAuthGuard } from 'src/authv0/auth.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.projectsService.create(createProjectDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.projectsService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') projectId: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    const user = req.user as { userId: string; username: string };
    return this.projectsService.update(
      user.userId,
      updateProjectDto,
      projectId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') projectId: string, @Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.projectsService.remove(user.userId, projectId);
  }
}
