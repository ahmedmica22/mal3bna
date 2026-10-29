import type { PrismaClient } from '@prisma/client';
type LedgerDb = Pick<PrismaClient, 'ledgerEntry'>;

export class LedgerService {
  static recordHeld(
    tx: LedgerDb,
    input: { reservationId: string; venueId: string; paymentId: string; amountPiastres: number },
  ) {
    return tx.ledgerEntry.create({
      data: {
        reservationId: input.reservationId,
        venueId: input.venueId,
        paymentId: input.paymentId,
        account: 'HELD',
        amountPiastres: input.amountPiastres,
        type: 'payment_held',
        idempotencyKey: `payment:${input.paymentId}:held`,
      },
    });
  }

  static recordRefund(
    tx: LedgerDb,
    input: {
      reservationId: string;
      venueId: string;
      paymentId: string;
      refundId: string;
      amountPiastres: number;
    },
  ) {
    return tx.ledgerEntry.create({
      data: {
        reservationId: input.reservationId,
        venueId: input.venueId,
        paymentId: input.paymentId,
        refundId: input.refundId,
        account: 'HELD',
        amountPiastres: -input.amountPiastres,
        type: 'refund',
        idempotencyKey: `refund:${input.refundId}:held`,
      },
    });
  }

  static async recordRelease(
    tx: LedgerDb,
    input: {
      reservationId: string;
      venueId: string;
      amountPiastres: number;
      commissionBp: number;
      idempotencyKey: string;
    },
  ) {
    const commission = Math.floor((input.amountPiastres * input.commissionBp) / 10_000);
    const venue = input.amountPiastres - commission;
    await tx.ledgerEntry.create({
      data: {
        reservationId: input.reservationId,
        venueId: input.venueId,
        account: 'HELD',
        amountPiastres: -input.amountPiastres,
        type: 'release',
        idempotencyKey: `${input.idempotencyKey}:held`,
      },
    });
    await tx.ledgerEntry.create({
      data: {
        reservationId: input.reservationId,
        venueId: input.venueId,
        account: 'COMMISSION',
        amountPiastres: commission,
        type: 'commission',
        idempotencyKey: `${input.idempotencyKey}:commission`,
      },
    });
    return tx.ledgerEntry.create({
      data: {
        reservationId: input.reservationId,
        venueId: input.venueId,
        account: 'VENUE_BALANCE',
        amountPiastres: venue,
        type: 'venue_release',
        idempotencyKey: `${input.idempotencyKey}:venue`,
      },
    });
  }
}
