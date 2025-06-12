import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { PrismaService } from 'src/prisma.service';
import * as argon2 from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signupUser(signupAuthDto: SignupAuthDto, session: Record<string, any>) {
    const { username, password } = signupAuthDto;

    const hashedPassword = await argon2.hash(password);

    try {
      const user = await this.prisma.user.create({
        data: { email: username, password: hashedPassword },
        omit: { password: true },
      });

      session.userId = user.id;

      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }

        console.error(error);
        throw new InternalServerErrorException(
          'An unexpected error occurred during signup.',
        );
      }
    }
  }

  async loginUser(loginAuthDto: LoginAuthDto, session: Record<string, any>) {
    const { username, password } = loginAuthDto;

    const user = await this.prisma.user.findUnique({
      where: { email: username },
    });

    if (!user) {
      throw new ForbiddenException('Incorrect credentials');
    }

    const isPasswordMatch = await argon2.verify(user.password, password);

    if (!isPasswordMatch) {
      throw new ForbiddenException('Incorrect credentials');
    }

    session.userId = user.id;

    return user;
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
