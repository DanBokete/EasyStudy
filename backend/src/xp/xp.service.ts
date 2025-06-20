import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { XP_RULES } from './xp.constants';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { XpEventType } from './types';
import { log } from 'console';

@Injectable()
export class XpService {
  constructor(private prisma: PrismaService) {}
  async applyXP(
    user: User,
    event: {
      type: XpEventType;
      count?: number;
      size?: string;
      minutes?: number;
    },
  ) {
    let xp = 0;
    if (event.type === 'study') {
      if (!event.minutes)
        throw new InternalServerErrorException('minutes not supplied');
      xp = this.calculateStudySessionXP(event.minutes);
    } else if (event.type === 'task') {
      xp = await this.getTaskXP(event.count || 0, user.id);
    } else if (event.type === 'project') {
      xp = this.getProjectXP(event.size as 'small' | 'medium' | 'large');
    } else if (event.type === 'login') {
      xp = this.getDailyLoginXP();
    }

    if (xp > 0) {
      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: user.id },
          data: { totalXp: user.totalXp + xp },
        }),
        this.prisma.xpLog.create({
          data: { xp, activity: event.type, userId: user.id },
        }),
      ]);
    }

    return xp;
  }

  calculateStudySessionXP(minutes: number): number {
    log('minutes: ' + minutes);
    const tiers = XP_RULES.studySession.xpTable
      .filter((tier) => minutes >= tier.duration)
      .sort((a, b) => a.duration - b.duration);

    return tiers.length ? tiers[0].xp : 0;
  }

  getProjectXP(size: 'small' | 'medium' | 'large') {
    return XP_RULES.project.xp[size] ?? 0;
  }

  async getTaskXP(taskCount: number, userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const tasksLoggedToday = await this.prisma.xpLog.count({
      where: { userId, createdAt: { gte: startOfDay } },
    });
    const max = XP_RULES.task.maxPerDay;
    if (tasksLoggedToday >= max) return 0;
    const xp = Math.min(taskCount, max) * XP_RULES.task.xpPerTask;
    const bonus = taskCount >= max ? XP_RULES.task.bonusForAll : 0;
    return xp + bonus;
  }

  getDailyLoginXP(): number {
    return XP_RULES.dailyLogin;
  }

  getStreakBonus(daysInARow: number): number {
    return daysInARow >= XP_RULES.streak.bonusAfter
      ? XP_RULES.streak.bonusXP
      : 0;
  }

  async getUserXp(userId: string) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      select: { totalXp: true },
    });
  }
}
