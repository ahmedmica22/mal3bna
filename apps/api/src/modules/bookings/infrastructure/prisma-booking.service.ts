import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { businessConstants } from '@court-booking/config';
import { calculatePrice } from '../../venues/domain/price-calculator';
import { DomainError } from '../../../domain/errors';
import type { BookingInput, Reservation } from '../domain/booking.types';
import type { PaymentGateway } from '../application/payment-gateway';
import {
  hashBookingInput,
  toReservation,
  toBookingListItem,
  type RawBookingListItem,
} from './booking-mappers';
import {
  executeCancelPreview,
  executePlayerCancel,
  executeRetryRefund,
  executeOperatorCancel,
} from './booking-cancellation.helper';
import {
  executeReportNoShow,
  executeFinalizeNoShows,
} from './booking-no-show.helper';

@Injectable()
export class PrismaBookingService {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject('PAYMENT_GATEWAY') private readonly gateway: PaymentGateway,
  ) {}

  async create(
    input: BookingInput,
    idempotencyKey: string,
  ): Promise<Reservation & { checkoutUrl: string }> {
    if (!idempotencyKey) throw new DomainError('VALIDATION_FAILED', 'Idempotency-Key is required');
    if (
      input.hours < 1 ||
      input.hours > businessConstants.MAX_HOURS_DEFAULT ||
      !Number.isInteger(input.hours)
    )
      throw new DomainError('TOO_MANY_HOURS', 'Booking hours are invalid');
    if (input.startsAt.getUTCMinutes() !== 0 || input.startsAt.getUTCSeconds() !== 0)
      throw new DomainError('VALIDATION_FAILED', 'Bookings start on the hour');
    const now = new Date();
    if (
      input.startsAt.getTime() < now.getTime() - 60 * 60_000 ||
      input.startsAt.getTime() > now.getTime() + 30 * 24 * 60 * 60_000
    )
      throw new DomainError('BOOKING_WINDOW_CLOSED', 'The booking is outside the booking window');

    const requestHash = hashBookingInput(input);
    const actorScope = input.playerId;
    const operation = 'booking.create';
    const existing = await this.prisma.idempotencyRecord.findUnique({
      where: { actorScope_operation_idempotencyKey: { actorScope, operation, idempotencyKey } },
    });
    if (existing) {
      if (existing.requestHash !== requestHash)
        throw new DomainError(
          'IDEMPOTENCY_KEY_REUSED',
          'Idempotency key was reused with a different request',
        );
      if (existing.responseBody && existing.resourceId) {
        const reservation = await this.get(input.playerId, existing.resourceId);
        const payment = await this.prisma.payment.findFirst({
          where: { reservationId: reservation.id },
          orderBy: { createdAt: 'desc' },
        });
        if (!payment)
          throw new DomainError('PAYMENT_NOT_CONFIRMED', 'Payment session is unavailable');
        return {
          ...reservation,
          checkoutUrl: `http://fake-payment.local/checkout/${payment.gatewaySessionId}`,
        };
      }
      throw new DomainError(
        'IDEMPOTENCY_IN_PROGRESS',
        'The booking request is still being processed',
      );
    }

    const court = await this.prisma.court.findFirst({
      where: {
        id: input.courtId,
        venueId: input.venueId,
        isActive: true,
        approvalStatus: 'approved',
      },
      include: {
        venue: true,
        priceRules: true,
      },
    });
    if (!court || court.venue.status !== 'approved') {
      throw new DomainError('NOT_FOUND', 'Venue not bookable');
    }
    if (input.hours > court.venue.maxHoursPerBooking) {
      throw new DomainError('TOO_MANY_HOURS', 'Too many hours');
    }

    const activeStrikes = await this.prisma.strike.count({
      where: { playerId: input.playerId, expiresAt: { gt: now } },
    });
    if (activeStrikes >= businessConstants.STRIKES_TO_BLOCK) {
      throw new DomainError('PLAYER_BLOCKED', 'Player is blocked due to strikes');
    }

    const endsAt = new Date(input.startsAt.getTime() + input.hours * 60 * 60_000);
    const breakdown = calculatePrice(
      court.priceRules,
      input.startsAt,
      input.hours,
      court.venue.timeZone,
    );
    const totalPiastres = breakdown.reduce((sum, item) => sum + item.pricePiastres, 0);
    const depositPiastres = Math.floor((totalPiastres * businessConstants.DEPOSIT_PERCENT + 50) / 100);
    const paymentOption = input.paymentOption ?? 'deposit';
    const amount = paymentOption === 'full' ? totalPiastres : depositPiastres;

    let reservationId = '';
    try {
      await this.prisma.$transaction(
        async (tx) => {
          const idem = await tx.idempotencyRecord.create({
            data: {
              actorScope,
              operation,
              idempotencyKey,
              requestHash,
              expiresAt: new Date(now.getTime() + 24 * 60 * 60_000),
            },
          });
          const reservation = await tx.reservation.create({
            data: {
              courtId: input.courtId,
              venueId: input.venueId,
              kind: 'booking',
              status: 'held',
              startsAt: input.startsAt,
              endsAt,
              playerId: input.playerId,
              holdExpiresAt: new Date(now.getTime() + businessConstants.HOLD_MINUTES * 60_000),
              totalPiastres,
              depositPiastres,
              paymentOption,
              dueAtVenuePiastres: totalPiastres - amount,
              commissionBp: court.venue.commissionBp,
              priceBreakdown: breakdown as unknown as Prisma.InputJsonValue,
              bookingCode: randomUUID().slice(0, 8).toUpperCase(),
            },
          });
          reservationId = reservation.id;
          await tx.payment.create({
            data: {
              reservationId,
              amountPiastres: amount,
              status: 'pending',
              gatewaySessionId: `pending-${reservationId}`,
            },
          });
          await tx.idempotencyRecord.update({
            where: { id: idem.id },
            data: {
              resourceId: reservationId,
              responseStatus: 201,
              responseBody: { reservationId },
              completedAt: now,
            },
          });
          await tx.auditLog.create({
            data: {
              actorId: input.playerId,
              actorRole: 'player',
              action: 'booking.created',
              targetType: 'reservation',
              targetId: reservationId,
              newValue: { totalPiastres, amount },
            },
          });
        },
        { maxWait: 30_000, timeout: 30_000 },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (
        message.includes('reservation_no_overlap') ||
        message.includes('23P01') ||
        message.includes('exclusion')
      )
        throw new DomainError('SLOT_TAKEN', 'The selected slot is unavailable');
      if (message.includes('Unique constraint') || message.includes('P2002')) {
        const retry = await this.prisma.idempotencyRecord.findUnique({
          where: { actorScope_operation_idempotencyKey: { actorScope, operation, idempotencyKey } },
        });
        if (retry?.requestHash !== requestHash)
          throw new DomainError(
            'IDEMPOTENCY_KEY_REUSED',
            'Idempotency key was reused with a different request',
          );
      }
      throw error;
    }

    const checkout = await this.gateway.createCheckout({
      reservationId,
      amountPiastres: amount,
      currency: 'EGP',
    });
    await this.prisma.payment.update({
      where: { gatewaySessionId: `pending-${reservationId}` },
      data: { gatewaySessionId: checkout.gatewaySessionId },
    });
    return {
      ...(await this.get(input.playerId, reservationId)),
      checkoutUrl: checkout.checkoutUrl,
    };
  }

  async list(playerId: string) {
    const rows = await this.prisma.reservation.findMany({
      where: { playerId },
      include: {
        player: { select: { name: true, phone: true, email: true } },
        court: { select: { id: true, name: true, sport: true, size: true } },
        venue: { select: { id: true, name: true, address: true } },
        dispute: { select: { id: true, status: true, playerMessage: true } },
        review: { select: { id: true, rating: true, comment: true } },
        payments: { select: { method: true } },
      },
      orderBy: [{ createdAt: 'desc' }, { startsAt: 'desc' }],
    });
    return rows.map((row) => toBookingListItem(row as unknown as RawBookingListItem));
  }

  async get(playerId: string, id: string): Promise<Reservation> {
    const row = await this.prisma.reservation.findFirst({ where: { id, playerId } });
    if (!row) throw new DomainError('NOT_FOUND', 'Booking not found');
    return toReservation(row);
  }

  async expireHolds(now = new Date()): Promise<number> {
    const result = await this.prisma.reservation.updateMany({
      where: { status: 'held', holdExpiresAt: { lte: now } },
      data: { status: 'expired' },
    });
    await this.prisma.payment.updateMany({
      where: { reservation: { status: 'expired' }, status: 'pending' },
      data: { status: 'expired' },
    });
    return result.count;
  }

  async cancelPreview(playerId: string, id: string, now = new Date()) {
    return executeCancelPreview(this.prisma, playerId, id, now);
  }

  async cancel(playerId: string, id: string, idempotencyKey: string, now = new Date()) {
    return executePlayerCancel(this.prisma, this.gateway, playerId, id, idempotencyKey, now);
  }

  async retryRefund(idempotencyKey: string) {
    return executeRetryRefund(this.prisma, this.gateway, idempotencyKey);
  }

  async operatorCancel(
    actorId: string,
    actorRole: 'owner' | 'admin',
    id: string,
    idempotencyKey: string,
  ) {
    return executeOperatorCancel(
      this.prisma,
      this.gateway,
      actorId,
      actorRole,
      id,
      idempotencyKey,
    );
  }

  async reportNoShow(ownerId: string, reservationId: string, now = new Date()) {
    return executeReportNoShow(this.prisma, ownerId, reservationId, now);
  }

  async finalizeNoShows(now = new Date()) {
    return executeFinalizeNoShows(this.prisma, this.gateway, now);
  }
}
