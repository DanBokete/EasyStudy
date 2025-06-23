import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma.service';
import { Response } from 'express';
import * as argon2 from 'argon2';
import { jwtConstants } from 'src/auth/auth.constants';
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

    response.cookie(
      'refresh_token',
      refreshToken,
      jwtConstants.refreshTokenOptions,
    );

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

    response.cookie(
      'access_token',
      accessToken,
      jwtConstants.accessTokenOptions,
    );
  }
}
