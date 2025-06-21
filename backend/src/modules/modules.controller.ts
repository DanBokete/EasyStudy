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
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { Module } from './entities/module.entity';
import { plainToInstance } from 'class-transformer';
import { getUserCredentials } from 'src/auth/utils';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('v1/modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post()
  async create(@Body() createModuleDto: CreateModuleDto, @Req() req: Request) {
    const user = getUserCredentials(req);
    const module = await this.modulesService.create(
      createModuleDto,
      user.userId,
    );
    return new Module(module);
  }

  @Get()
  async findAll(@Req() req: Request) {
    const user = getUserCredentials(req);
    return plainToInstance(
      Module,
      await this.modulesService.findAll(user.userId),
    );
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const user = getUserCredentials(req);
    const module = await this.modulesService.findOne(user.userId, id);
    return new Module(module);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuleDto: UpdateModuleDto) {
    return this.modulesService.update(+id, updateModuleDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') moduleId: string,
    @Session() session: Record<string, any>,
  ) {
    const userId = session.userId as string;
    return await this.modulesService.remove(userId, moduleId);
  }
}
