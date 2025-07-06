import { Expose } from 'class-transformer';

export class Grade {
  id: string;
  title: string;
  description: string | null;
  date: string;
  userId: string;
  subjectId: string;
  score: number;
  maxScore: number;
  createdAt: Date;
  updatedAt: Date;

  @Expose()
  get percent(): number {
    return Math.floor((this.score / this.maxScore) * 10000) / 100;
  }

  constructor(partial: Partial<Grade>) {
    Object.assign(this, partial);
  }
}
