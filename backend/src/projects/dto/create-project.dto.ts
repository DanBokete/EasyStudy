import { ProjectStatus } from '@prisma/client';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsOptional()
  dueDate: string;

  @IsString()
  @IsOptional()
  status: ProjectStatus;

  @IsString()
  subjectId: string;
}
