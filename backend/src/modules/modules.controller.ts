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

@UseGuards(JwtAuthGuard)
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  create(@Body() createModuleDto: CreateModuleDto, @Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.modulesService.create(createModuleDto, user.userId);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as { userId: string; username: string };
    return this.modulesService.findAll(user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(+id, updateModuleDto);
  }

  @Delete(':id')
  remove(
    @Param('id') moduleId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.modulesService.remove(userId, moduleId);
  }
}
