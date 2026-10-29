import type {
  AccessClaims,
  ClientType,
  PasswordResetRecord,
  SessionRecord,
  UserRecord,
  VerificationTokenRecord,
} from '../domain/auth.types';
import type { Role } from '@court-booking/shared';

export interface PasswordHasher {
  hash(value: string): Promise<string>;
  verify(hash: string, value: string): Promise<boolean>;
}

export interface TokenService {
  signAccessToken(claims: AccessClaims): Promise<string>;
  verifyAccessToken(token: string): Promise<AccessClaims>;
  createOpaqueToken(bytes: number): string;
}

export interface EmailSender {
  sendVerification(user: UserRecord, token: string): Promise<void>;
  sendPasswordReset(user: UserRecord, token: string): Promise<void>;
}

export interface AuthRepository {
  findUserById(id: string): Promise<UserRecord | undefined>;
  findUserByEmail(email: string): Promise<UserRecord | undefined>;
  findUserByPhone(phone: string): Promise<UserRecord | undefined>;
  saveUser(user: UserRecord): Promise<void>;
  saveVerificationToken(token: VerificationTokenRecord): Promise<void>;
  findVerificationToken(tokenHash: string): Promise<VerificationTokenRecord | undefined>;
  savePasswordResetToken(token: PasswordResetRecord): Promise<void>;
  findPasswordResetToken(tokenHash: string): Promise<PasswordResetRecord | undefined>;
  saveSession(session: SessionRecord): Promise<void>;
  findSessionByRefreshHash(tokenHash: string): Promise<SessionRecord | undefined>;
  findSessionByConsumedRefreshHash(tokenHash: string): Promise<SessionRecord | undefined>;
  findSessionById(id: string): Promise<SessionRecord | undefined>;
  revokeSession(id: string): Promise<void>;
  revokeSessionFamily(familyId: string): Promise<void>;
  revokeAllSessions(userId: string): Promise<void>;
  listSessions(userId: string): Promise<SessionRecord[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
  client: ClientType;
  deviceInfo: string | null;
  ipAddress: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  role: Role;
}
