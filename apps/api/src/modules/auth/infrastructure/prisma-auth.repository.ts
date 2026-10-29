import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { PrismaClient } from '@prisma/client';
import type { Language, Role } from '@court-booking/shared';
import type { ClientType, UserStatus } from '../domain/auth.types';
import type { AuthRepository } from '../application/ports';
import type {
  PasswordResetRecord,
  SessionRecord,
  UserRecord,
  VerificationTokenRecord,
} from '../domain/auth.types';

@Injectable()
export class PrismaAuthRepository implements AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUserById(id: string): Promise<UserRecord | undefined> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return undefined;

    const now = new Date();
    const upcomingPlayerBookings = await this.prisma.reservation.count({
      where: {
        playerId: id,
        endsAt: { gt: now },
        status: { in: ['confirmed', 'draft'] },
      },
    });

    const unpaidPlayerBalance = await this.prisma.reservation.count({
      where: {
        playerId: id,
        dueAtVenuePiastres: { gt: 0 },
        status: 'confirmed',
      },
    });

    let upcomingOwnerBookings = 0;
    if (user.role === 'owner') {
      const venues = await this.prisma.venue.findMany({
        where: { ownerId: id },
        select: { id: true },
      });
      if (venues.length > 0) {
        upcomingOwnerBookings = await this.prisma.reservation.count({
          where: {
            venueId: { in: venues.map((v) => v.id) },
            endsAt: { gt: now },
            status: { in: ['confirmed', 'draft'] },
          },
        });
      }
    }

    const hasUpcoming = upcomingPlayerBookings > 0 || upcomingOwnerBookings > 0;
    const hasUnpaid = unpaidPlayerBalance > 0;

    return toUser(user, hasUpcoming, hasUnpaid);
  }

  async findUserByEmail(email: string): Promise<UserRecord | undefined> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? toUser(user) : undefined;
  }

  async findUserByPhone(phone: string): Promise<UserRecord | undefined> {
    const cleanPhone = phone.trim().replace(/[\s\-\(\)]/g, '');
    const variants = Array.from(
      new Set([
        cleanPhone,
        cleanPhone.startsWith('+') ? cleanPhone.slice(1) : `+${cleanPhone}`,
        cleanPhone.startsWith('0') ? `+2${cleanPhone}` : cleanPhone,
        cleanPhone.startsWith('+2') ? cleanPhone.slice(2) : cleanPhone,
        cleanPhone.startsWith('+20') ? `0${cleanPhone.slice(3)}` : cleanPhone,
        cleanPhone.startsWith('20') ? `0${cleanPhone.slice(2)}` : cleanPhone,
      ]),
    );
    const user = await this.prisma.user.findFirst({
      where: {
        phone: { in: variants },
      },
    });
    return user ? toUser(user) : undefined;
  }

  async saveUser(user: UserRecord): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: user.id },
      create: {
        id: user.id,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
        status: user.status,
        name: user.name,
        phone: user.phone,
        language: user.language,
        emailVerifiedAt: user.emailVerifiedAt,
        phoneVerified: user.phoneVerified,
        deletedAt: user.deletedAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      update: {
        email: user.email,
        passwordHash: user.passwordHash,
        status: user.status,
        name: user.name,
        phone: user.phone,
        language: user.language,
        emailVerifiedAt: user.emailVerifiedAt,
        phoneVerified: user.phoneVerified,
        deletedAt: user.deletedAt,
      },
    });
  }

  async saveVerificationToken(token: VerificationTokenRecord): Promise<void> {
    await this.prisma.emailVerificationToken.create({
      data: {
        userId: token.userId,
        tokenHash: token.tokenHash,
        expiresAt: token.expiresAt,
        usedAt: token.usedAt,
      },
    });
  }

  async findVerificationToken(tokenHash: string): Promise<VerificationTokenRecord | undefined> {
    const token = await this.prisma.emailVerificationToken.findFirst({ where: { tokenHash } });
    return token
      ? {
          userId: token.userId,
          tokenHash: token.tokenHash,
          expiresAt: token.expiresAt,
          usedAt: token.usedAt,
        }
      : undefined;
  }

  async savePasswordResetToken(token: PasswordResetRecord): Promise<void> {
    await this.prisma.passwordResetToken.create({
      data: {
        userId: token.userId,
        tokenHash: token.tokenHash,
        expiresAt: token.expiresAt,
        usedAt: token.usedAt,
      },
    });
  }

  async findPasswordResetToken(tokenHash: string): Promise<PasswordResetRecord | undefined> {
    const token = await this.prisma.passwordResetToken.findFirst({ where: { tokenHash } });
    return token
      ? {
          userId: token.userId,
          tokenHash: token.tokenHash,
          expiresAt: token.expiresAt,
          usedAt: token.usedAt,
        }
      : undefined;
  }

  async saveSession(session: SessionRecord): Promise<void> {
    await this.prisma.session.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        userId: session.userId,
        refreshTokenHash: session.refreshTokenHash,
        familyId: session.familyId,
        client: session.client,
        deviceInfo: session.deviceInfo,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt,
        lastUsedAt: session.lastUsedAt,
      },
      update: {
        refreshTokenHash: session.refreshTokenHash,
        client: session.client,
        expiresAt: session.expiresAt,
        revokedAt: session.revokedAt,
        lastUsedAt: session.lastUsedAt,
      },
    });
    if (session.consumedRefreshTokenHashes.size > 0) {
      await this.prisma.refreshTokenHistory.createMany({
        data: [...session.consumedRefreshTokenHashes].map((tokenHash) => ({
          id: randomUUID(),
          sessionId: session.id,
          tokenHash,
        })),
        skipDuplicates: true,
      });
    }
  }

  async findSessionByRefreshHash(tokenHash: string): Promise<SessionRecord | undefined> {
    const session = await this.prisma.session.findFirst({
      where: { refreshTokenHash: tokenHash, revokedAt: null },
      include: { refreshTokenHistory: true },
    });
    return session ? toSession(session) : undefined;
  }

  async findSessionByConsumedRefreshHash(tokenHash: string): Promise<SessionRecord | undefined> {
    const history = await this.prisma.refreshTokenHistory.findUnique({
      where: { tokenHash },
      include: { session: { include: { refreshTokenHistory: true } } },
    });
    return history ? toSession(history.session) : undefined;
  }

  async findSessionById(id: string): Promise<SessionRecord | undefined> {
    const session = await this.prisma.session.findUnique({
      where: { id },
      include: { refreshTokenHistory: true },
    });
    return session ? toSession(session) : undefined;
  }

  async revokeSession(id: string): Promise<void> {
    await this.prisma.session.updateMany({ where: { id }, data: { revokedAt: new Date() } });
  }

  async revokeSessionFamily(familyId: string): Promise<void> {
    await this.prisma.session.updateMany({ where: { familyId }, data: { revokedAt: new Date() } });
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.prisma.session.updateMany({ where: { userId }, data: { revokedAt: new Date() } });
  }

  async listSessions(userId: string): Promise<SessionRecord[]> {
    const sessions = await this.prisma.session.findMany({
      where: { userId },
      include: { refreshTokenHistory: true },
    });
    return sessions.map(toSession);
  }
}

function toUser(
  user: {
    id: string;
    email: string;
    passwordHash: string;
    role: Role;
    status: UserStatus;
    name: string;
    phone: string | null;
    language: Language;
    emailVerifiedAt: Date | null;
    phoneVerified: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  },
  hasUpcomingBookings = false,
  hasUnpaidBalance = false,
): UserRecord {
  return { ...user, hasUpcomingBookings, hasUnpaidBalance };
}

function toSession(session: {
  id: string;
  userId: string;
  refreshTokenHash: string;
  familyId: string;
  client: ClientType;
  deviceInfo: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
  refreshTokenHistory: Array<{ tokenHash: string }>;
}): SessionRecord {
  return {
    id: session.id,
    userId: session.userId,
    refreshTokenHash: session.refreshTokenHash,
    familyId: session.familyId,
    client: session.client,
    deviceInfo: session.deviceInfo,
    expiresAt: session.expiresAt,
    revokedAt: session.revokedAt,
    lastUsedAt: session.lastUsedAt,
    consumedRefreshTokenHashes: new Set(session.refreshTokenHistory.map((item) => item.tokenHash)),
  };
}
