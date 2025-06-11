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
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { SessionAuthGuard } from 'src/auth/auth.guard';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @UseGuards(SessionAuthGuard)
  @Post()
  create(
    @Body() createModuleDto: CreateModuleDto,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.modulesService.create(createModuleDto, userId);
  }

  @UseGuards(SessionAuthGuard)
  @Get()
  findAll(@Session() session: Record<string, any>) {
    const userId = session.userId as string;
    return this.modulesService.findAll(userId);
  }

  @UseGuards(SessionAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesService.findOne(+id);
  }

  @UseGuards(SessionAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(+id, updateModuleDto);
  }

  @UseGuards(SessionAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') moduleId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return this.modulesService.remove(userId, moduleId);
  }
}
