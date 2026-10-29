import { PrismaClient } from '@prisma/client';
import { DomainError } from '../../../domain/errors';
import type { PaymentGateway } from '../application/payment-gateway';
import { CancellationPolicy } from '../domain/cancellation-policy';
import { LedgerService } from './ledger.service';

const cancellationPolicy = new CancellationPolicy();

export async function executeCancelPreview(
  prisma: PrismaClient,
  playerId: string,
  id: string,
  now = new Date(),
) {
  const booking = await prisma.reservation.findFirst({
    where: { id, playerId },
    include: { payments: true },
  });
  if (!booking) throw new DomainError('NOT_FOUND', 'Booking not found');
  if (!['held', 'confirmed'].includes(booking.status)) {
    throw new DomainError('INVALID_STATE', 'Booking cannot be cancelled');
  }
  const paidPiastres = booking.payments
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amountPiastres, 0);

  return {
    reservationId: booking.id,
    startsAt: booking.startsAt,
    ...cancellationPolicy.decide({
      actor: 'player',
      startsAt: booking.startsAt,
      now,
      paidPiastres,
      depositPiastres: booking.depositPiastres,
    }),
  };
}

export async function executePlayerCancel(
  prisma: PrismaClient,
  gateway: PaymentGateway,
  playerId: string,
  id: string,
  idempotencyKey: string,
  now = new Date(),
) {
  if (!idempotencyKey) throw new DomainError('VALIDATION_FAILED', 'Idempotency-Key is required');
  const preview = await executeCancelPreview(prisma, playerId, id, now);
  const booking = await prisma.reservation.findUniqueOrThrow({
    where: { id },
    include: { payments: true },
  });
  const paid = booking.payments.find((payment) => payment.status === 'paid');
  let refundId: string | undefined;

  if (preview.refundPiastres > 0 && paid) {
    const existing = await prisma.refund.findUnique({ where: { idempotencyKey } });
    if (existing) {
      return {
        reservationId: id,
        status: 'cancelled',
        refundId: existing.id,
        refundPiastres: existing.amountPiastres,
      };
    }
    const gatewayRefund = await gateway.refundPayment({
      sessionId: paid.gatewaySessionId,
      amountPiastres: preview.refundPiastres,
      idempotencyKey,
    });
    const refund = await prisma.$transaction(async (tx) => {
      const created = await tx.refund.create({
        data: {
          paymentId: paid.id,
          reservationId: id,
          amountPiastres: preview.refundPiastres,
          reason: 'player_cancel',
          status: gatewayRefund.refunded ? 'succeeded' : 'failed',
          gatewayRefundId: gatewayRefund.gatewayRefundId,
          idempotencyKey,
        },
      });
      if (gatewayRefund.refunded) {
        await LedgerService.recordRefund(tx, {
          reservationId: id,
          venueId: booking.venueId,
          paymentId: paid.id,
          refundId: created.id,
          amountPiastres: created.amountPiastres,
        });
      }
      if (gatewayRefund.refunded && preview.retainedPiastres > 0) {
        await LedgerService.recordRelease(tx, {
          reservationId: id,
          venueId: booking.venueId,
          amountPiastres: preview.retainedPiastres,
          commissionBp: booking.commissionBp,
          idempotencyKey: `cancel:${id}`,
        });
      }
      if (gatewayRefund.refunded) {
        await tx.reservation.update({
          where: { id },
          data: {
            status: 'cancelled',
            cancelledAt: now,
            cancelledByRole: 'player',
            cancelReason: 'player_cancel',
          },
        });
      }
      return created;
    });
    refundId = refund.id;
    if (!gatewayRefund.refunded) {
      throw new DomainError('REFUND_FAILED', 'Refund is pending retry');
    }
  } else {
    await prisma.$transaction(async (tx) => {
      if (paid && preview.retainedPiastres > 0) {
        await LedgerService.recordRelease(tx, {
          reservationId: id,
          venueId: booking.venueId,
          amountPiastres: preview.retainedPiastres,
          commissionBp: booking.commissionBp,
          idempotencyKey: `cancel:${id}`,
        });
      }
      await tx.reservation.update({
        where: { id },
        data: {
          status: 'cancelled',
          cancelledAt: now,
          cancelledByRole: 'player',
          cancelReason: 'player_cancel',
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: playerId,
          actorRole: 'player',
          action: 'booking.cancelled',
          targetType: 'reservation',
          targetId: id,
          reason: 'player_cancel',
          newValue: { refundPiastres: 0, retainedPiastres: preview.retainedPiastres },
        },
      });
    });
  }
  return {
    reservationId: id,
    status: 'cancelled',
    refundId,
    refundPiastres: preview.refundPiastres,
  };
}

export async function executeRetryRefund(
  prisma: PrismaClient,
  gateway: PaymentGateway,
  idempotencyKey: string,
) {
  const refund = await prisma.refund.findUnique({
    where: { idempotencyKey },
    include: { payment: true, reservation: true },
  });
  if (!refund) throw new DomainError('NOT_FOUND', 'Refund not found');
  if (refund.status === 'succeeded') return { status: 'succeeded', refundId: refund.id };

  const gatewayRefund = await gateway.refundPayment({
    sessionId: refund.payment.gatewaySessionId,
    amountPiastres: refund.amountPiastres,
    idempotencyKey,
  });

  if (!gatewayRefund.refunded) {
    await prisma.refund.update({
      where: { id: refund.id },
      data: { attempts: { increment: 1 }, lastError: 'Gateway did not confirm refund' },
    });
    throw new DomainError('REFUND_FAILED', 'Refund is pending retry');
  }

  await prisma.$transaction(async (tx) => {
    await tx.refund.update({
      where: { id: refund.id },
      data: {
        status: 'succeeded',
        attempts: { increment: 1 },
        lastError: null,
        gatewayRefundId: gatewayRefund.gatewayRefundId,
      },
    });
    await LedgerService.recordRefund(tx, {
      reservationId: refund.reservationId,
      venueId: refund.reservation.venueId,
      paymentId: refund.paymentId,
      refundId: refund.id,
      amountPiastres: refund.amountPiastres,
    });
    const retained = Math.max(0, refund.payment.amountPiastres - refund.amountPiastres);
    if (retained > 0) {
      await LedgerService.recordRelease(tx, {
        reservationId: refund.reservationId,
        venueId: refund.reservation.venueId,
        amountPiastres: retained,
        commissionBp: refund.reservation.commissionBp,
        idempotencyKey: `cancel:${refund.reservationId}`,
      });
    }
    await tx.reservation.update({
      where: { id: refund.reservationId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledByRole: 'player',
        cancelReason: 'player_cancel',
      },
    });
  });
  return { status: 'succeeded', refundId: refund.id };
}

export async function executeOperatorCancel(
  prisma: PrismaClient,
  gateway: PaymentGateway,
  actorId: string,
  actorRole: 'owner' | 'admin',
  id: string,
  idempotencyKey: string,
) {
  const effectiveKey = idempotencyKey || `${actorRole}-cancel-${id}-${Date.now()}`;
  const booking = await prisma.reservation.findUnique({
    where: { id },
    include: { payments: true, venue: true },
  });
  if (!booking || !['held', 'confirmed', 'arrived'].includes(booking.status)) {
    throw new DomainError('NOT_FOUND', 'Booking not found');
  }
  if (actorRole === 'owner' && booking.venue.ownerId !== actorId) {
    throw new DomainError('NOT_FOUND', 'Booking not found');
  }
  const paid = booking.payments.find((payment) => payment.status === 'paid');
  if (paid) {
    const gatewayRefund = await gateway.refundPayment({
      sessionId: paid.gatewaySessionId,
      amountPiastres: paid.amountPiastres,
      idempotencyKey: effectiveKey,
    });
    if (!gatewayRefund.refunded) {
      throw new DomainError('REFUND_FAILED', 'Refund is pending retry');
    }
    await prisma.$transaction(async (tx) => {
      const refund = await tx.refund.create({
        data: {
          paymentId: paid.id,
          reservationId: id,
          amountPiastres: paid.amountPiastres,
          reason: `${actorRole}_cancel`,
          status: 'succeeded',
          gatewayRefundId: gatewayRefund.gatewayRefundId,
          idempotencyKey: effectiveKey,
        },
      });
      await LedgerService.recordRefund(tx, {
        reservationId: id,
        venueId: booking.venueId,
        paymentId: paid.id,
        refundId: refund.id,
        amountPiastres: refund.amountPiastres,
      });
      await tx.reservation.update({
        where: { id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          cancelledByRole: actorRole,
          cancelReason: `${actorRole}_cancel`,
        },
      });
      await tx.auditLog.create({
        data: {
          actorId,
          actorRole,
          action: 'booking.operator_cancelled',
          targetType: 'reservation',
          targetId: id,
          reason: `${actorRole}_cancel`,
        },
      });
    });
  } else {
    await prisma.reservation.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledByRole: actorRole,
        cancelReason: `${actorRole}_cancel`,
      },
    });
  }
  return { reservationId: id, status: 'cancelled', refundPiastres: paid?.amountPiastres ?? 0 };
}
