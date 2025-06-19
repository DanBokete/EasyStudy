import { IsAlpha, IsString, MinLength } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsAlpha()
  @MinLength(1)
  name: string;
}
