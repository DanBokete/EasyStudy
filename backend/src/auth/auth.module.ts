import { Module, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma.service';
import { APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtRefreshStrategy, JwtStrategy } from './jwt.strategy';
import { TokenService } from './utils';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    { provide: APP_PIPE, useValue: new ValidationPipe({ whitelist: true }) },
    JwtStrategy,
    JwtRefreshStrategy,
    TokenService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
