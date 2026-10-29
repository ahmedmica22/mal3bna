import type { Language, Role } from '@court-booking/shared';

export type UserStatus = 'active' | 'blocked' | 'suspended' | 'pending' | 'deleted';
export type ClientType = 'web' | 'mobile';

export interface UserRecord {
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
  hasUpcomingBookings: boolean;
  hasUnpaidBalance: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionRecord {
  id: string;
  userId: string;
  familyId: string;
  client: ClientType;
  refreshTokenHash: string;
  consumedRefreshTokenHashes: Set<string>;
  deviceInfo: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  lastUsedAt: Date | null;
}

export interface VerificationTokenRecord {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface PasswordResetRecord {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface AccessClaims {
  sub: string;
  role: Role;
  sid: string;
}

export interface PublicUser {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  name: string;
  phone: string | null;
  language: Language;
  emailVerifiedAt: Date | null;
  phoneVerified: boolean;
}
