import { Injectable } from '@nestjs/common';
import type { AuthRepository } from './ports';
import type {
  PasswordResetRecord,
  SessionRecord,
  UserRecord,
  VerificationTokenRecord,
} from '../domain/auth.types';

@Injectable()
export class InMemoryAuthRepository implements AuthRepository {
  private readonly users = new Map<string, UserRecord>();
  private readonly verificationTokens = new Map<string, VerificationTokenRecord>();
  private readonly passwordResetTokens = new Map<string, PasswordResetRecord>();
  private readonly sessions = new Map<string, SessionRecord>();

  async findUserById(id: string): Promise<UserRecord | undefined> {
    return this.users.get(id);
  }
  async findUserByEmail(email: string): Promise<UserRecord | undefined> {
    return [...this.users.values()].find((user) => user.email === email);
  }
  async findUserByPhone(phone: string): Promise<UserRecord | undefined> {
    const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
    const variants = new Set([
      cleanPhone,
      cleanPhone.startsWith('+') ? cleanPhone.slice(1) : `+${cleanPhone}`,
      cleanPhone.startsWith('0') ? `+2${cleanPhone}` : cleanPhone,
      cleanPhone.startsWith('+2') ? cleanPhone.slice(2) : cleanPhone,
      cleanPhone.startsWith('+20') ? `0${cleanPhone.slice(3)}` : cleanPhone,
    ]);
    return [...this.users.values()].find(
      (user) => user.phone && variants.has(user.phone.replace(/[\s\-\(\)]/g, '')),
    );
  }
  async saveUser(user: UserRecord): Promise<void> {
    this.users.set(user.id, user);
  }
  async saveVerificationToken(token: VerificationTokenRecord): Promise<void> {
    this.verificationTokens.set(token.tokenHash, token);
  }
  async findVerificationToken(tokenHash: string): Promise<VerificationTokenRecord | undefined> {
    return this.verificationTokens.get(tokenHash);
  }
  async savePasswordResetToken(token: PasswordResetRecord): Promise<void> {
    this.passwordResetTokens.set(token.tokenHash, token);
  }
  async findPasswordResetToken(tokenHash: string): Promise<PasswordResetRecord | undefined> {
    return this.passwordResetTokens.get(tokenHash);
  }
  async saveSession(session: SessionRecord): Promise<void> {
    this.sessions.set(session.id, session);
  }
  async findSessionByRefreshHash(tokenHash: string): Promise<SessionRecord | undefined> {
    return [...this.sessions.values()].find(
      (session) => session.refreshTokenHash === tokenHash && session.revokedAt === null,
    );
  }
  async findSessionByConsumedRefreshHash(tokenHash: string): Promise<SessionRecord | undefined> {
    return [...this.sessions.values()].find((session) =>
      session.consumedRefreshTokenHashes.has(tokenHash),
    );
  }
  async findSessionById(id: string): Promise<SessionRecord | undefined> {
    return this.sessions.get(id);
  }
  async revokeSession(id: string): Promise<void> {
    const session = this.sessions.get(id);
    if (session) session.revokedAt = new Date();
  }
  async revokeSessionFamily(familyId: string): Promise<void> {
    for (const session of this.sessions.values())
      if (session.familyId === familyId) session.revokedAt = new Date();
  }
  async revokeAllSessions(userId: string): Promise<void> {
    for (const session of this.sessions.values())
      if (session.userId === userId) session.revokedAt = new Date();
  }
  async listSessions(userId: string): Promise<SessionRecord[]> {
    return [...this.sessions.values()].filter((session) => session.userId === userId);
  }
}
