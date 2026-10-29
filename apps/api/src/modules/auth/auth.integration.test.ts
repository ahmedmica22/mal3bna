import { describe, expect, it } from 'vitest';
import { PrismaClient } from '@prisma/client';
import { AuthService } from './application/auth.service';
import { PrismaAuthRepository } from './infrastructure/prisma-auth.repository';
import { Argon2PasswordHasher } from './infrastructure/argon2-password.hasher';
import { JwtTokenService } from './infrastructure/jwt-token.service';
import { MailpitEmailSender } from './infrastructure/mailpit.email-sender';

const integration = process.env.RUN_INTEGRATION === '1' ? describe : describe.skip;

integration('auth PostgreSQL and Mailpit integration', () => {
  it('persists registration, delivers verification, rotates sessions, and revokes reuse', async () => {
    const prisma = new PrismaClient();
    const repository = new PrismaAuthRepository(prisma);
    const service = new AuthService(
      repository,
      new Argon2PasswordHasher(),
      new JwtTokenService(),
      new MailpitEmailSender(),
    );
    const email = `integration-${Date.now()}@example.test`;
    try {
      const user = await service.register({
        email,
        password: 'Integration strong 1',
        role: 'player',
        name: 'Integration Player',
        phone: null,
      });
      const messages = (await fetch('http://127.0.0.1:8025/api/v1/messages').then((response) =>
        response.json(),
      )) as { messages: Array<{ ID: string }> };
      expect(messages.messages.length).toBeGreaterThan(0);
      const latest = messages.messages[0];
      if (!latest) throw new Error('Mailpit returned no message');
      const message = (await fetch(`http://127.0.0.1:8025/api/v1/message/${latest.ID}`).then(
        (response) => response.json(),
      )) as { Text: string };
      const token = message.Text.match(/Verification token: (\S+)/)?.[1];
      if (!token) throw new Error('Verification token was not found in Mailpit');
      await service.verifyEmail(token);
      const session = await service.login({
        email,
        password: 'Integration strong 1',
        client: 'web',
        deviceInfo: 'integration',
        ipAddress: '127.0.0.1',
      });
      const rotated = await service.refresh(session.refreshToken, 'web');
      expect(rotated.refreshToken).not.toBe(session.refreshToken);
      await expect(service.refresh(session.refreshToken, 'web')).rejects.toMatchObject({
        code: 'REFRESH_TOKEN_REUSE',
      });
      const storedSessions = await repository.listSessions(user.id);
      expect(storedSessions.every((item) => item.revokedAt !== null)).toBe(true);
    } finally {
      const users = await prisma.user.findMany({ where: { email } });
      const userIds = users.map((item) => item.id);
      await prisma.session.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.emailVerificationToken.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.passwordResetToken.deleteMany({ where: { userId: { in: userIds } } });
      await prisma.user.deleteMany({ where: { email } });
      await prisma.$disconnect();
    }
  });
});
