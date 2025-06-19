import { Module } from '@nestjs/common';
import { XpService } from './xp.service';
import { PrismaService } from '../prisma.service';
import { XpController } from './xp.controller';

@Module({
  controllers: [XpController],
  providers: [XpService, PrismaService],
  exports: [XpService],
})
export class XpModule {}
