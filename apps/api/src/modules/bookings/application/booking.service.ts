import { Inject, Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { businessConstants } from '@court-booking/config';
import { DomainError } from '../../../domain/errors';
import type { BookingInput, IdempotencyResult, Reservation } from '../domain/booking.types';
import type { PaymentGateway } from './payment-gateway';

@Injectable()
export class BookingService {
  private readonly reservations = new Map<string, Reservation>();
  private readonly idempotency = new Map<string, IdempotencyResult>();
  constructor(@Inject('PAYMENT_GATEWAY') private readonly gateway: PaymentGateway) {}
  async create(
    input: BookingInput,
    idempotencyKey: string,
  ): Promise<Reservation & { checkoutUrl: string }> {
    const requestHash = createHash('sha256')
      .update(JSON.stringify({ ...input, startsAt: input.startsAt.toISOString() }))
      .digest('hex');
    const replay = this.idempotency.get(`${input.playerId}:${idempotencyKey}`);
    if (replay) {
      if (replay.requestHash !== requestHash)
        throw new DomainError(
          'IDEMPOTENCY_KEY_REUSED',
          'Idempotency key was reused with a different request',
        );
      const checkout = await this.gateway.createCheckout({
        reservationId: replay.response.id,
        amountPiastres:
          replay.response.paymentOption === 'deposit'
            ? replay.response.depositPiastres
            : replay.response.totalPiastres,
        currency: 'EGP',
      });
      return { ...replay.response, checkoutUrl: checkout.checkoutUrl };
    }
    if (
      input.hours < 1 ||
      input.hours > businessConstants.MAX_HOURS_DEFAULT ||
      !Number.isInteger(input.hours)
    )
      throw new DomainError('TOO_MANY_HOURS', 'Booking hours are invalid');
    if (input.startsAt.getUTCMinutes() !== 0 || input.startsAt.getUTCSeconds() !== 0)
      throw new DomainError('VALIDATION_FAILED', 'Bookings start on the hour');
    const endsAt = new Date(input.startsAt.getTime() + input.hours * 3_600_000);
    const now = new Date();
    for (const existing of this.reservations.values()) {
      if (
        existing.courtId === input.courtId &&
        existing.status === 'held' &&
        existing.holdExpiresAt <= now
      )
        existing.status = 'expired';
      if (
        existing.courtId === input.courtId &&
        ['held', 'confirmed'].includes(existing.status) &&
        existing.startsAt < endsAt &&
        input.startsAt < existing.endsAt
      )
        throw new DomainError('SLOT_TAKEN', 'The selected slot is unavailable');
    }
    const reservation: Reservation = {
      id: randomUUID(),
      bookingCode: randomUUID().slice(0, 8).toUpperCase(),
      playerId: input.playerId,
      courtId: input.courtId,
      venueId: input.venueId,
      startsAt: input.startsAt,
      endsAt,
      status: 'held',
      holdExpiresAt: new Date(now.getTime() + businessConstants.HOLD_MINUTES * 60_000),
      totalPiastres: input.totalPiastres,
      depositPiastres: input.depositPiastres,
      paidPiastres: 0,
      paymentOption: input.paymentOption,
    };
    this.reservations.set(reservation.id, reservation);
    this.idempotency.set(`${input.playerId}:${idempotencyKey}`, {
      requestHash,
      response: reservation,
    });
    const checkout = await this.gateway.createCheckout({
      reservationId: reservation.id,
      amountPiastres:
        input.paymentOption === 'deposit' ? input.depositPiastres : input.totalPiastres,
      currency: 'EGP',
    });
    return { ...reservation, checkoutUrl: checkout.checkoutUrl };
  }
  get(playerId: string, id: string): Reservation {
    const reservation = this.reservations.get(id);
    if (!reservation || reservation.playerId !== playerId)
      throw new DomainError('NOT_FOUND', 'Booking not found');
    return reservation;
  }
  confirmPayment(playerId: string, id: string, sessionId: string): Promise<Reservation> {
    const reservation = this.get(playerId, id);
    if (reservation.holdExpiresAt <= new Date())
      throw new DomainError('HOLD_EXPIRED', 'Booking hold expired');
    return this.gateway.verifyPayment(sessionId).then((payment) => {
      if (!payment.paid || payment.currency !== 'EGP')
        throw new DomainError('PAYMENT_NOT_CONFIRMED', 'Payment was not confirmed');
      reservation.status = 'confirmed';
      reservation.paidPiastres = payment.amountPiastres;
      return reservation;
    });
  }
}
