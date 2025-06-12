/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class SignupAuthDto {
  @IsString()
  username: string;

  @IsStrongPassword()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
