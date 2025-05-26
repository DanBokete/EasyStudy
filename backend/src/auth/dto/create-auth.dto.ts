/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString, IsStrongPassword } from 'class-validator';

export class CreateAuthDto {
  @IsString()
  username: string;

  @IsStrongPassword()
  password: string;
}
