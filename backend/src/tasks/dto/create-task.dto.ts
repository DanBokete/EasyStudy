import { TaskStatus } from '@prisma/client';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  status: TaskStatus;

  @IsDateString()
  @IsOptional()
  dueDate: string;

  @IsString()
  @IsOptional()
  time: string;
}
