import { PrismaClient } from '@prisma/client';
import { DomainError } from '../../../domain/errors';
import type { PaymentGateway } from '../application/payment-gateway';
import { LedgerService } from './ledger.service';

export async function executeReportNoShow(
  prisma: PrismaClient,
  ownerId: string,
  reservationId: string,
  now = new Date(),
) {
  const booking = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: { venue: true, dispute: true },
  });
  if (!booking || booking.venue.ownerId !== ownerId) {
    throw new DomainError('NOT_FOUND', 'Booking not found');
  }
  if (!['confirmed', 'arrived'].includes(booking.status)) {
    throw new DomainError('INVALID_STATE', 'Booking cannot be reported as no-show');
  }

  const isDev =
    ['development', 'test'].includes(process.env.NODE_ENV ?? '') || !process.env.NODE_ENV;
  if (
    !isDev &&
    (now.getTime() < booking.startsAt.getTime() + 15 * 60_000 ||
      now.getTime() > booking.endsAt.getTime() + 24 * 60 * 60_000)
  ) {
    throw new DomainError(
      'NO_SHOW_WINDOW_CLOSED',
      'No-show report is outside its allowed window',
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.reservation.update({
      where: { id: reservationId },
      data: { status: 'no_show_pending', noShowMarkedAt: now },
    });
    const dispute = await tx.dispute.create({
      data: {
        reservationId,
        strikeId: null,
        playerMessage: 'Venue reported a no-show',
        status: 'open',
      },
    });
    await tx.auditLog.create({
      data: {
        actorId: ownerId,
        actorRole: 'owner',
        action: 'booking.no_show_reported',
        targetType: 'reservation',
        targetId: reservationId,
        newValue: { disputeId: dispute.id },
      },
    });
    return {
      reservationId: updated.id,
      status: updated.status,
      disputeId: dispute.id,
      disputeDeadline: new Date(now.getTime() + 48 * 60 * 60_000),
    };
  });
}

export async function executeFinalizeNoShows(
  prisma: PrismaClient,
  gateway: PaymentGateway,
  now = new Date(),
): Promise<number> {
  const pending = await prisma.reservation.findMany({
    where: { status: 'no_show_pending' },
    include: { venue: true, dispute: true, payments: true },
  });
  let finalized = 0;
  for (const booking of pending) {
    if (
      !booking.dispute ||
      booking.dispute.status !== 'open' ||
      booking.dispute.createdAt.getTime() + 48 * 60 * 60_000 > now.getTime() ||
      !booking.playerId
    ) {
      continue;
    }
    const paid = booking.payments.find((payment) => payment.status === 'paid');
    const refundAmount = paid ? Math.max(0, paid.amountPiastres - booking.depositPiastres) : 0;
    let gatewayRefund: { refunded: boolean; gatewayRefundId: string } | undefined;
    if (paid && refundAmount > 0) {
      gatewayRefund = await gateway.refundPayment({
        sessionId: paid.gatewaySessionId,
        amountPiastres: refundAmount,
        idempotencyKey: `no-show:${booking.id}`,
      });
    }
    if (gatewayRefund && !gatewayRefund.refunded) continue;

    await prisma.$transaction(async (tx) => {
      const strike = await tx.strike.create({
        data: {
          playerId: booking.playerId!,
          reservationId: booking.id,
          venueId: booking.venueId,
          expiresAt: new Date(now.getTime() + 183 * 24 * 60 * 60_000),
        },
      });
      await tx.dispute.update({
        where: { id: booking.dispute!.id },
        data: {
          status: 'upheld',
          strikeId: strike.id,
          decidedAt: now,
          decisionNote: 'No dispute received within 48 hours',
        },
      });
      if (paid && gatewayRefund && refundAmount > 0) {
        const refund = await tx.refund.create({
          data: {
            paymentId: paid.id,
            reservationId: booking.id,
            amountPiastres: refundAmount,
            reason: 'no_show',
            status: 'succeeded',
            gatewayRefundId: gatewayRefund.gatewayRefundId,
            idempotencyKey: `no-show:${booking.id}`,
          },
        });
        await LedgerService.recordRefund(tx, {
          reservationId: booking.id,
          venueId: booking.venueId,
          paymentId: paid.id,
          refundId: refund.id,
          amountPiastres: refundAmount,
        });
        if (now >= booking.endsAt) {
          await LedgerService.recordRelease(tx, {
            reservationId: booking.id,
            venueId: booking.venueId,
            amountPiastres: booking.depositPiastres,
            commissionBp: booking.commissionBp,
            idempotencyKey: `no-show-release:${booking.id}`,
          });
        }
      }
      await tx.reservation.update({ where: { id: booking.id }, data: { status: 'no_show' } });
      await tx.auditLog.create({
        data: {
          action: 'booking.no_show_finalized',
          targetType: 'reservation',
          targetId: booking.id,
          newValue: { strikeId: strike.id, refundPiastres: refundAmount },
        },
      });
    });
    finalized += 1;
  }
  return finalized;
}
