import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const auth = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined;
    if (!auth || !auth.startsWith('Bearer ')) throw new UnauthorizedException('Missing bearer token');
    const token = auth.slice(7);
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'dev-secret' }) as {
        sub: number;
        role?: 'ADMIN' | 'USER';
      };
      req.user = { id: payload.sub, role: payload.role };
      return true;
    } catch (e) {
      throw new ForbiddenException('Invalid token');
    }
  }
}


