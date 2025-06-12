import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateStudySessionDto {
  @IsString()
  @IsOptional()
  activity: string | null;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsString()
  moduleId: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;
}
