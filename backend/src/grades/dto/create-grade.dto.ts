import { IsNumber, IsString } from 'class-validator';

export class CreateGradeDto {
  @IsString()
  moduleId: string;

  @IsString()
  title: string;

  @IsNumber()
  score: number;

  @IsNumber()
  maxScore: number;
}
