import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupAuthDto } from './dto/signup-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from '../prisma.service';
import * as argon2 from 'argon2';

import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { TokenService } from './utils';
import { jwtConstants } from './auth.constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private tokenService: TokenService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto, response: Response) {
    const hashPassword = await argon2.hash(signupAuthDto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: signupAuthDto.username,
          password: hashPassword,
          name: signupAuthDto.name,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...sanitizedUser } = user;
      await this.login(
        { username: signupAuthDto.username, password: signupAuthDto.password },
        response,
      );

      return sanitizedUser;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
    throw new InternalServerErrorException('Signup failed');
  }

  async login(loginAuthDto: LoginAuthDto, response: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginAuthDto.username },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect credentials');
    }

    const isPasswordMatch = await argon2.verify(
      user.password,
      loginAuthDto.password,
    );

    if (!isPasswordMatch) {
      throw new ForbiddenException('Incorrect credentials');
    }

    this.tokenService.createAccessToken(user, response);
    await this.tokenService.createRefreshToken(user, response);

    return;
  }

  async refreshToken(request: Request, response: Response) {
    if (!request.user) throw new ForbiddenException();

    // uses JWT REFRESH STRATEGY
    const requestUser = request.user as unknown as {
      id: string;
      username: string;
    };

    const user = await this.prisma.user.findUnique({
      where: { id: requestUser.id },
    });

    if (!user) throw new ForbiddenException('user does not exist');

    const originalRefreshToken = request.cookies.refresh_token as
      | string
      | undefined;

    if (!originalRefreshToken) {
      throw new ForbiddenException('Cannot get refresh token');
    }

    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { userId: user.id },
    });

    for (const storedToken of storedTokens) {
      // if token is expired, skip
      if (storedToken.expiresAt < new Date()) continue;

      const isMatch = await argon2.verify(
        storedToken.token,
        originalRefreshToken,
      );

      if (isMatch) {
        if (!storedToken.valid) {
          await this.prisma.refreshToken.updateMany({
            where: { userId: user.id },
            data: { valid: false },
          });

          response.clearCookie('access_token', {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
          });

          console.error('refresh token stolen');
          throw new ForbiddenException('possible replay attack detected');
        }

        await this.prisma.refreshToken.update({
          where: { userId: user.id, id: storedToken.id },
          data: { valid: false },
        });

        this.tokenService.createAccessToken(user, response);
        await this.tokenService.createRefreshToken(user, response);

        return;
      }
    }
    throw new ForbiddenException('Cannot find refresh token session');
  }

  async verifyUserJWTRefreshToken(refreshToken: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async getProfile(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }

  async logout(userId: string, response: Response) {
    await this.prisma.$transaction([
      this.prisma.refreshToken.updateMany({
        where: { userId },
        data: { valid: false },
      }),
      this.prisma.accessToken.updateMany({
        where: { userId },
        data: { valid: false },
      }),
    ]);
    response.clearCookie('access_token', {
      httpOnly: true,
      path: '/',
      maxAge: jwtConstants.accessTokenMaxAge,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    response.clearCookie('refresh_token', {
      httpOnly: true,
      maxAge: jwtConstants.refreshTokenMaxAge,
      path: '/auth/refresh',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
  }
}
