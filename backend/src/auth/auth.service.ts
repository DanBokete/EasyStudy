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
import { jwtConstants } from './auth.constants';
import { TokenService } from '../token/token.service';

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
      where: { userId: user.id, expiresAt: { gt: new Date() } },
    });

    for (const storedToken of storedTokens) {
      const isMatch = await argon2.verify(
        storedToken.token,
        originalRefreshToken,
      );

      if (!isMatch) continue;

      if (!storedToken.valid) {
        // grace period for cases such as slow request/ tab syncing delays/page reload before a new token is stored
        const withinGracePeriod =
          Date.now() - storedToken.createdAt.getTime() < 1_000 * 60 * 60;

        if (!withinGracePeriod) {
          await this.prisma.refreshToken.updateMany({
            where: { userId: user.id },
            data: { valid: false },
          });

          response.clearCookie('access_token', jwtConstants.accessTokenOptions);

          console.error('refresh token stolen');
          throw new ForbiddenException('possible replay attack detected');
        }

        console.warn('token reuse within grace period');
      }

      await this.prisma.refreshToken.update({
        where: { userId: user.id, id: storedToken.id },
        data: { valid: false },
      });

      this.tokenService.createAccessToken(user, response);
      await this.tokenService.createRefreshToken(user, response);

      return;
    }
    throw new ForbiddenException('Cannot find refresh token session');

    // this.tokenService.createAccessToken(user, response);
    // await this.tokenService.createRefreshToken(user, response);
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
    response.clearCookie('access_token', jwtConstants.accessTokenOptions);
    response.clearCookie('refresh_token', jwtConstants.refreshTokenOptions);
  }
}
