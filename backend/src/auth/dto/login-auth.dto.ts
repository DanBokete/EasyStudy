import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  username: string;

  @IsString()
  password: string;
}
