/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  username: string;

  @IsString()
  password: string;
}
