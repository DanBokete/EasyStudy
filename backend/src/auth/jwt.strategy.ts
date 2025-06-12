import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { PrismaService } from 'src/prisma.service';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        (request: Request) => request.cookies?.access_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.accessToken,
    });
  }

  validate(payload: { sub: string; username: string }) {
    return { userId: payload.sub, username: payload.username };
  }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private prisma: PrismaService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request.cookies?.refresh_token,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.refreshToken,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: { sub: string; username: string }) {
    return this.authService.verifyUserJWTRefreshToken(
      req.cookies.refresh_token,
      payload.sub,
    );
    return { userId: payload.sub, username: payload.username };
  }
}
