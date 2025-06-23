import { Request } from 'express';
import { BadRequestException } from '@nestjs/common';

export function getUserCredentials(req: Request) {
  if (!req.user) throw new BadRequestException();
  const user = req.user;
  return user;
}
