/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsStrongPassword, Length } from 'class-validator';

export class SignupAuthDto {
  @IsString()
  username: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  @Length(1)
  name: string;
}
