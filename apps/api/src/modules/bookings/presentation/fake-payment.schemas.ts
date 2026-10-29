import { z } from 'zod';

export const fakePaymentInputSchema = z
  .object({ outcome: z.enum(['success', 'failure', 'pending']) })
  .strict();
export const fakePaymentResponseSchema = z
  .object({
    outcome: z.enum(['success', 'failure', 'pending']),
    isTestPayment: z.literal(true),
    booking: z
      .object({
        id: z.string().uuid(),
        bookingCode: z.string(),
        playerId: z.string().uuid(),
        courtId: z.string().uuid(),
        venueId: z.string().uuid(),
        startsAt: z.string().datetime(),
        endsAt: z.string().datetime(),
        holdExpiresAt: z.string().datetime(),
        status: z.enum([
          'held',
          'confirmed',
          'arrived',
          'completed',
          'no_show_pending',
          'no_show',
          'cancelled',
          'expired',
        ]),
        totalPiastres: z.number().int(),
        depositPiastres: z.number().int(),
        paidPiastres: z.number().int(),
        paymentOption: z.enum(['deposit', 'full']),
      })
      .strict(),
  })
  .strict();
