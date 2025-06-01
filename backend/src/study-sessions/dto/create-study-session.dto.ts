import { IsOptional, IsString } from 'class-validator';

export class CreateStudySessionDto {
  @IsString()
  activity: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsString()
  moduleId: string;

  @IsString()
  startTime: string;

  @IsString()
  @IsOptional()
  endTime: string | null;
}
