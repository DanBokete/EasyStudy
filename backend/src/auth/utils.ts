import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { jwtConstants } from './constants';
import { PrismaService } from 'src/prisma.service';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createRefreshToken(user: User, response: Response): Promise<string> {
    const payload = {
      sub: user.id,
      username: user.email,
    };

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: jwtConstants.refreshTokenExpiresIn,
      secret: jwtConstants.refreshToken,
    });

    const expiresAt = jwtConstants.refreshTokenExpiresAtDate();

    await this.prisma.refreshToken.create({
      data: {
        token: await argon2.hash(refreshToken),
        userId: user.id,
        expiresAt,
      },
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: jwtConstants.refreshTokenMaxAge,
      path: '/auth/refresh',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    return refreshToken;
  }

  createAccessToken(user: User, response: Response) {
    const payload = {
      sub: user.id,
      username: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtConstants.accessTokenExpiresIn,
      secret: jwtConstants.accessToken,
    });

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: jwtConstants.accessTokenMaxAge,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}
