import { z } from 'zod';

// Serialized HTTP DTOs: dates are ISO strings rather than domain Date objects.
export const publicUserResponseSchema = z
  .object({
    id: z.string().uuid(),
    email: z.string().email(),
    role: z.enum(['player', 'owner', 'admin']),
    status: z.enum(['active', 'blocked', 'suspended', 'pending']),
    name: z.string(),
    phone: z.string().nullable(),
    language: z.enum(['en', 'ar']),
    emailVerifiedAt: z.string().datetime().nullable(),
    phoneVerified: z.boolean(),
  })
  .strict();
export const authResponseSchema = z
  .object({
    accessToken: z.string(),
    sessionId: z.string().uuid(),
    role: z.enum(['player', 'owner', 'admin']),
    refreshToken: z.string().optional(),
  })
  .strict();
export const acceptedResponseSchema = z.object({ accepted: z.literal(true) }).strict();

export const registerSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    role: z.enum(['player', 'owner']),
    name: z.string().trim().min(1),
    phone: z.string().trim().nullable().optional(),
  })
  .strict();
export const loginSchema = z
  .object({
    email: z.string().min(1, 'Email or phone number is required'),
    password: z.string().min(1, 'Password is required'),
  })
  .strict();
export const emailSchema = z.object({ email: z.string().email() }).strict();
export const tokenSchema = z.object({ token: z.string().min(1) }).strict();
export const mobileRefreshSchema = z.object({ refreshToken: z.string().min(1) }).strict();
export const resetSchema = z.object({ token: z.string().min(1), password: z.string() }).strict();
export const changePasswordSchema = z
  .object({ currentPassword: z.string(), password: z.string() })
  .strict();
export const updateMeSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    phone: z.string().trim().nullable().optional(),
    language: z.enum(['en', 'ar']).optional(),
  })
  .strict();
