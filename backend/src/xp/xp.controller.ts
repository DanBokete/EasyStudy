import {
  Controller,
  Get,
  UseGuards,
  Req,
  InternalServerErrorException,
} from '@nestjs/common';
import { XpService } from './xp.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('v1/xp')
export class XpController {
  constructor(private readonly xpService: XpService) {}

  @Get()
  findAll(@Req() req: Request) {
    if (!req.user) throw new InternalServerErrorException('could not get user');
    return this.xpService.getUserXp(req.user.userId);
  }
}
