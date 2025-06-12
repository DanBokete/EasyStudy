import { Controller, Post, Body, Session, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';

import { SignupAuthDto } from './dto/signup-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  login(
    @Body() loginAuthDto: LoginAuthDto,
    @Session() session: Record<string, any>,
  ) {
    return this.authService.loginUser(loginAuthDto, session);
  }

  @Post('signup')
  signup(
    @Body() signupAuthDto: SignupAuthDto,
    @Session() session: Record<string, any>,
  ) {
    return this.authService.signupUser(signupAuthDto, session);
  }
}
