import { Grade } from '@prisma/client';
import { Expose } from 'class-transformer';

export class Module {
  id: string;
  description: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  Grade: Grade[];

  @Expose()
  get averageGrade(): number {
    let sumOfGrades = 0;
    const numberOfGrades = this.Grade.length;
    this.Grade.forEach((grade) => {
      sumOfGrades += grade.score / grade.maxScore;
    });

    return Math.floor((sumOfGrades / numberOfGrades) * 10000) / 100;
  }

  constructor(partial: Partial<Module>) {
    Object.assign(this, partial);
  }
}
