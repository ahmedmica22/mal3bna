import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AuthService } from '../application/auth.service';
import { TOKEN_SERVICE } from '../application/auth.service';
import { IS_PUBLIC_KEY, ROLES_KEY } from './metadata';
import type { PublicUser } from '../domain/auth.types';

export type AuthenticatedRequest = Request & { user?: PublicUser; authSessionId?: string };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(Reflector) private readonly reflector: Reflector,
    @Inject(AuthService) private readonly authService: AuthService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: import('../application/ports').TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.header('authorization');
    if (!authorization?.startsWith('Bearer '))
      throw new UnauthorizedException('Authentication is required');
    try {
      const claims = await this.tokenService.verifyAccessToken(
        authorization.slice('Bearer '.length),
      );
      request.user = await this.authService.authenticate(claims);
      request.authSessionId = claims.sid;
      return true;
    } catch {
      throw new UnauthorizedException('Authentication is invalid');
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(@Inject(Reflector) private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    const roles = this.reflector.getAllAndOverride<PublicUser['role'][] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles?.length) throw new ForbiddenException('Route has no authorization declaration');
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!request.user || !roles.includes(request.user.role))
      throw new ForbiddenException('Role is not permitted');
    return true;
  }
}
