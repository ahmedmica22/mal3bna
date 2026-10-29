import { Injectable } from '@nestjs/common';
import { jwtVerify, SignJWT } from 'jose';
import { randomBytes } from 'node:crypto';
import { businessConstants } from '@court-booking/config';
import type { AccessClaims } from '../domain/auth.types';
import type { TokenService } from '../application/ports';

@Injectable()
export class JwtTokenService implements TokenService {
  private readonly secret = new TextEncoder().encode(
    process.env.JWT_ACCESS_SECRET ?? 'm2-local-access-secret-change-me-32chars',
  );

  async signAccessToken(claims: AccessClaims): Promise<string> {
    return new SignJWT({ role: claims.role, sid: claims.sid })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject(claims.sub)
      .setIssuedAt()
      .setExpirationTime(`${businessConstants.ACCESS_TOKEN_MINUTES}m`)
      .sign(this.secret);
  }

  async verifyAccessToken(token: string): Promise<AccessClaims> {
    const result = await jwtVerify(token, this.secret);
    const payload = result.payload;
    if (typeof payload.sub !== 'string' || typeof payload.sid !== 'string' || !isRole(payload.role))
      throw new Error('Invalid access claims');
    return { sub: payload.sub, sid: payload.sid, role: payload.role };
  }

  createOpaqueToken(bytes: number): string {
    return randomBytes(bytes).toString('base64url');
  }
}

function isRole(value: unknown): value is AccessClaims['role'] {
  return value === 'player' || value === 'owner' || value === 'admin';
}
