import { TaskStatus } from '@prisma/client';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  projectId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string | null;

  @IsString()
  @IsOptional()
  status: TaskStatus;

  @IsDateString()
  @IsOptional()
  dueDate: string | null;

  @IsString()
  @IsOptional()
  time: string | null;
}
