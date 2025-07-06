import { IsAlpha, IsString, MinLength } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @IsAlpha()
  @MinLength(1)
  name: string;
}
