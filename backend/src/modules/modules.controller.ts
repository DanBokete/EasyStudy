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
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createModuleDto: CreateModuleDto, @Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.modulesService.create(createModuleDto, user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.modulesService.findAll(user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(+id, updateModuleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') moduleId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.modulesService.remove(userId, moduleId);
  }
}
