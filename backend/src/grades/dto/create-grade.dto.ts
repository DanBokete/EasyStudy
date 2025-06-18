import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateGradeDto {
  @IsString()
  moduleId: string;

  @IsString()
  title: string;

  @IsNumber()
  score: number;

  @IsDateString()
  date: string;

  @IsNumber()
  maxScore: number;
}
