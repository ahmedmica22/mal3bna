import { Body, Controller, Headers, Post, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { DomainError } from '../../../domain/errors';
import { CurrentUser, Public, Roles } from './metadata';
import type { PublicUser } from '../domain/auth.types';

import {
  changePasswordSchema,
  emailSchema,
  loginSchema,
  mobileRefreshSchema,
  registerSchema,
  resetSchema,
  tokenSchema,
} from './schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() body: unknown): Promise<PublicUser> {
    const input = registerSchema.parse(body);
    return this.authService.register({ ...input, phone: input.phone ?? null });
  }

  @Public()
  @Post('verify-email')
  verifyEmail(@Body() body: unknown): Promise<PublicUser> {
    return this.authService.verifyEmail(tokenSchema.parse(body).token);
  }

  @Public()
  @Post('resend-verification')
  async resendVerification(@Body() body: unknown): Promise<{ accepted: true }> {
    const email = emailSchema.parse(body).email;
    await this.authService.requestVerification(email);
    return { accepted: true };
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: unknown,
    @Headers('x-client') client: string | undefined,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const input = loginSchema.parse(body);
    const tokens = await this.authService.login({
      ...input,
      client: client === 'mobile' ? 'mobile' : 'web',
      deviceInfo: request.header('user-agent') ?? null,
      ipAddress: request.ip ?? 'unknown',
    });
    setRefreshCookie(response, tokens.refreshToken, client === 'mobile');
    return authResponse(tokens, client === 'mobile');
  }

  @Public()
  @Post('refresh')
  async refresh(
    @Body() body: unknown,
    @Headers('x-client') client: string | undefined,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const refreshToken =
      client === 'mobile'
        ? mobileRefreshSchema.parse(body).refreshToken
        : readCookie(request, 'refresh_token');
    if (!refreshToken) throw new DomainError('REFRESH_TOKEN_REQUIRED', 'Refresh token is required');
    const tokens = await this.authService.refresh(
      refreshToken,
      client === 'mobile' ? 'mobile' : 'web',
    );
    setRefreshCookie(response, tokens.refreshToken, client === 'mobile');
    return authResponse(tokens, client === 'mobile');
  }

  @Roles('player', 'owner', 'admin')
  @Post('logout')
  async logout(
    @CurrentUser() user: PublicUser,
    @Req() request: Request,
  ): Promise<{ accepted: true }> {
    const sessionId = getSessionId(request);
    await this.authService.logout(user.id, sessionId);
    return { accepted: true };
  }

  @Roles('player', 'owner', 'admin')
  @Post('logout-all')
  async logoutAll(@CurrentUser() user: PublicUser): Promise<{ accepted: true }> {
    await this.authService.logoutAll(user.id);
    return { accepted: true };
  }

  @Public()
  @Post('forgot-password')
  async forgotPassword(@Body() body: unknown): Promise<{ accepted: true }> {
    await this.authService.requestPasswordReset(emailSchema.parse(body).email);
    return { accepted: true };
  }

  @Public()
  @Post('reset-password')
  async resetPassword(@Body() body: unknown): Promise<{ accepted: true }> {
    const input = resetSchema.parse(body);
    await this.authService.resetPassword(input.token, input.password);
    return { accepted: true };
  }

  @Roles('player', 'owner', 'admin')
  @Post('change-password')
  async changePassword(
    @CurrentUser() user: PublicUser,
    @Body() body: unknown,
  ): Promise<{ accepted: true }> {
    const input = changePasswordSchema.parse(body);
    await this.authService.changePassword(user.id, input.currentPassword, input.password);
    return { accepted: true };
  }
}

export interface AuthResponse {
  accessToken: string;
  sessionId: string;
  role: PublicUser['role'];
  refreshToken?: string;
}
function authResponse(
  tokens: {
    accessToken: string;
    sessionId: string;
    role: PublicUser['role'];
    refreshToken: string;
  },
  mobile: boolean,
): AuthResponse {
  return {
    accessToken: tokens.accessToken,
    sessionId: tokens.sessionId,
    role: tokens.role,
    ...(mobile ? { refreshToken: tokens.refreshToken } : {}),
  };
}
function setRefreshCookie(response: Response, token: string, mobile: boolean): void {
  if (!mobile)
    response.setHeader(
      'set-cookie',
      `refresh_token=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Lax; Path=/api/v1/auth`,
    );
}
function readCookie(request: Request, name: string): string | null {
  const cookie = request
    .header('cookie')
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}
function getSessionId(request: Request & { authSessionId?: string }): string {
  if (!request.authSessionId) throw new DomainError('UNAUTHENTICATED', 'Authentication is invalid');
  return request.authSessionId;
}
