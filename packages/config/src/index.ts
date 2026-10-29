import { z } from 'zod';

export const businessConstants = {
  DEPOSIT_PERCENT: 30,
  HOLD_MINUTES: 10,
  SLOT_MINUTES: 60,
  MAX_HOURS_DEFAULT: 4,
  MIN_LEAD_MINUTES: 0,
  MAX_ADVANCE_DAYS: 30,
  FREE_CANCEL_HOURS: 24,
  NO_SHOW_GRACE_MINUTES: 15,
  NO_SHOW_MARK_WINDOW_HOURS: 24,
  AUTO_COMPLETE_HOURS: 24,
  DISPUTE_WINDOW_HOURS: 48,
  STRIKES_TO_BLOCK: 4,
  STRIKE_TTL_MONTHS: 6,
  APPEAL_WAIT_DAYS: 30,
  COMMISSION_MIN_BP: 1000,
  COMMISSION_MAX_BP: 2000,
  PRICE_CHANGE_DELAY_HOURS: 24,
  ACCESS_TOKEN_MINUTES: 15,
  REFRESH_TOKEN_DAYS: 30,
  RESET_TOKEN_MINUTES: 30,
  MAX_POSITIONS: 2,
} as const;

export const securityConstants = {
  AUTH_MIN_PASSWORD_LENGTH: 8,
  ADMIN_MIN_PASSWORD_LENGTH: 12,
  AUTH_RATE_LIMIT_WINDOW_SECONDS: 60,
  AUTH_RATE_LIMIT_MAX_ATTEMPTS: 30,
  REFRESH_TOKEN_BYTES: 32,
  RESET_TOKEN_BYTES: 32,
  VERIFICATION_TOKEN_BYTES: 32,
  VERIFICATION_TOKEN_HOURS: 24,
  REVOKE_ALL_SESSIONS_ON_PASSWORD_CHANGE: true,
} as const;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_PREFIX: z.string().min(1).default('api/v1'),
  DATABASE_URL: z.string().url(),
  MAILPIT_URL: z.string().url().optional(),
  MAIL_FROM_EMAIL: z.string().email().optional(),
  MAIL_FROM_NAME: z.string().min(1).optional(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  WEB_ORIGIN: z.string().url(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
});

export type Environment = z.infer<typeof envSchema>;
export const parseEnvironment = (input: Record<string, string | undefined>): Environment =>
  envSchema.parse(input);
