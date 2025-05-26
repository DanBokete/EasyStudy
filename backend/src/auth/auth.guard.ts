// session-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

// Extend the SessionData interface to include userId
declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.session && request.session.userId) {
      return true;
    }

    throw new UnauthorizedException('User is not authenticated');
  }
}
