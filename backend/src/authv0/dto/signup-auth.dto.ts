/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignupAuthDto {
  @IsEmail()
  username: string;

  @IsStrongPassword()
  password: string;
}
