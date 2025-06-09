import { IsOptional, IsString } from 'class-validator';

export class CreateStudySessionDto {
  @IsString()
  @IsOptional()
  activity: string | null;

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
