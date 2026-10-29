import { describe, expect, it } from 'vitest';
import { AuthService } from './auth.service';
import { InMemoryAuthRepository } from './in-memory-auth.repository';
import type { EmailSender, PasswordHasher, TokenService } from './ports';
import type { AccessClaims, UserRecord } from '../domain/auth.types';
import type { Role } from '@court-booking/shared';

class FakeHasher implements PasswordHasher {
  async hash(value: string): Promise<string> {
    return `hash:${value}`;
  }
  async verify(hash: string, value: string): Promise<boolean> {
    return hash === `hash:${value}`;
  }
}

class FakeTokens implements TokenService {
  private counter = 0;
  async signAccessToken(claims: AccessClaims): Promise<string> {
    return `${claims.sub}.${claims.sid}.${claims.role}`;
  }
  async verifyAccessToken(token: string): Promise<AccessClaims> {
    const [sub, sid, role] = token.split('.');
    return { sub: sub ?? '', sid: sid ?? '', role: (role ?? 'player') as Role };
  }
  createOpaqueToken(bytes: number): string {
    this.counter += 1;
    return `opaque-${this.counter}-${bytes}`;
  }
}

class FakeEmailSender implements EmailSender {
  verification: string[] = [];
  reset: string[] = [];
  async sendVerification(_user: UserRecord, token: string): Promise<void> {
    this.verification.push(token);
  }
  async sendPasswordReset(_user: UserRecord, token: string): Promise<void> {
    this.reset.push(token);
  }
}

function createService(): {
  service: AuthService;
  repository: InMemoryAuthRepository;
  email: FakeEmailSender;
} {
  const repository = new InMemoryAuthRepository();
  const email = new FakeEmailSender();
  return {
    service: new AuthService(repository, new FakeHasher(), new FakeTokens(), email),
    repository,
    email,
  };
}

describe('AuthService', () => {
  it('registers, verifies email, logs in, rotates refresh tokens, and detects reuse', async () => {
    const { service, repository, email } = createService();
    const user = await service.register({
      email: 'Player@Example.com',
      password: 'Strong password 1',
      role: 'player',
      name: 'Player',
      phone: null,
    });
    expect(user.email).toBe('player@example.com');
    expect(user.emailVerifiedAt).toBeNull();
    await service.verifyEmail(email.verification[0] ?? '');
    const tokens = await service.login({
      email: 'player@example.com',
      password: 'Strong password 1',
      client: 'web',
      deviceInfo: null,
      ipAddress: '127.0.0.1',
    });
    const rotated = await service.refresh(tokens.refreshToken, 'web');
    expect(rotated.refreshToken).not.toBe(tokens.refreshToken);
    await expect(service.refresh(tokens.refreshToken, 'web')).rejects.toMatchObject({
      code: 'REFRESH_TOKEN_REUSE',
    });
    expect(
      (await repository.listSessions(user.id)).every((session) => session.revokedAt !== null),
    ).toBe(true);
  });

  it('keeps forgot-password responses generic and consumes reset tokens once', async () => {
    const { service, email } = createService();
    await service.register({
      email: 'owner@example.com',
      password: 'Strong password 1',
      role: 'owner',
      name: 'Owner',
      phone: null,
    });
    await expect(service.requestPasswordReset('missing@example.com')).resolves.toBeUndefined();
    await service.requestPasswordReset('owner@example.com');
    await service.resetPassword(email.reset[0] ?? '', 'Another strong password 1');
    await expect(
      service.resetPassword(email.reset[0] ?? '', 'Third strong password 1'),
    ).rejects.toMatchObject({ code: 'INVALID_RESET_TOKEN' });
  });

  it('revokes sessions on password change and blocks deletion with obligations', async () => {
    const { service, repository } = createService();
    const user = await service.register({
      email: 'player@example.com',
      password: 'Strong password 1',
      role: 'player',
      name: 'Player',
      phone: null,
    });
    await service.login({
      email: user.email,
      password: 'Strong password 1',
      client: 'web',
      deviceInfo: null,
      ipAddress: '127.0.0.1',
    });
    await service.changePassword(user.id, 'Strong password 1', 'New strong password 1');
    expect(
      (await repository.listSessions(user.id)).every((session) => session.revokedAt !== null),
    ).toBe(true);
    const stored = await repository.findUserById(user.id);
    if (!stored) throw new Error('test user missing');
    stored.hasUpcomingBookings = true;
    await expect(service.deleteMe(user.id)).rejects.toThrowError(/obligations remain/);

    stored.hasUpcomingBookings = false;
    stored.hasUnpaidBalance = false;
    await service.deleteMe(user.id);
    const deletedUser = await repository.findUserById(user.id);
    expect(deletedUser?.status).toBe('deleted');
    expect(deletedUser?.deletedAt).toBeInstanceOf(Date);
    expect(deletedUser?.email).toBe(`deleted+${user.id}@deleted.invalid`);
  });
});
