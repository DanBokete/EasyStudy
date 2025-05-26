import {
  ForbiddenException,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupAuthDto } from './dto/signup-auth.dto';
// import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { Response, Request } from 'express';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupAuthDto: SignupAuthDto) {
    const hashPassword = await argon2.hash(signupAuthDto.password);

    try {
      const user = await this.prisma.user.create({
        data: { ...signupAuthDto, password: hashPassword },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async login(loginAuthDto: LoginAuthDto, response: Response) {
    const user = await this.prisma.user.findUnique({
      where: { username: loginAuthDto.username },
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

    const payload = {
      sub: user.id,
      username: user.username,
    };

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '2d',
      secret: jwtConstants.refreshToken,
    });

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
      path: '/auth/refresh',
    });

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '60s',
      secret: jwtConstants.accessToken,
    });

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });

    return;
  }

  refreshToken(request: Request, response: Response) {
    if (!request.user) throw new BadRequestException();

    const user = request.user as { id: string; username: string };

    const accessToken = this.jwtService.sign(
      { sub: user.id, username: user.username },
      {
        expiresIn: '60s',
        secret: jwtConstants.accessToken,
      },
    );

    response.cookie('access_token', accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    return;
  }

  async verifyUserJWTRefreshToken(refreshToken: string, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
