import { z } from 'zod';

const adminBookingSchema = z
  .object({
    id: z.string().uuid(),
    bookingCode: z.string(),
    isTestPayment: z.boolean(),
    kind: z.enum(['booking', 'manual', 'block']),
    status: z.enum([
      'held',
      'confirmed',
      'arrived',
      'completed',
      'no_show',
      'no_show_pending',
      'cancelled',
      'expired',
    ]),
    startsAt: z.string().datetime(),
    endsAt: z.string().datetime(),
    totalPiastres: z.number().int().nonnegative(),
    paidPiastres: z.number().int().nonnegative(),
    dueAtVenuePiastres: z.number().int().nonnegative(),
    createdAt: z.string().datetime(),
    playerId: z.string().uuid().nullable(),
    customerName: z.string().nullable(),
    court: z
      .object({
        id: z.string().uuid(),
        name: z.string(),
        sport: z.enum(['football', 'padel']),
        size: z.number().int().nullable(),
      })
      .strict(),
    venue: z.object({ id: z.string().uuid(), name: z.string() }).strict(),
    player: z.object({ id: z.string().uuid(), name: z.string() }).strict().nullable(),
  })
  .strict();

export const adminBookingsResponseSchema = z
  .object({
    items: z.array(adminBookingSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
    totalPages: z.number().int().nonnegative(),
  })
  .strict();
