import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TokenController],
  providers: [TokenService, PrismaService, JwtService],
})
export class TokenModule {}
