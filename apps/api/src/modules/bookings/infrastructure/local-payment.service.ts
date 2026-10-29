import { Inject, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { createHmac } from 'node:crypto';
import { DomainError } from '../../../domain/errors';
import { FakePaymentGateway } from '../application/fake-payment.gateway';
import type { PaymentGateway } from '../application/payment-gateway';
import { WebhookService, type PaymentWebhookPayload } from './webhook.service';

@Injectable()
export class LocalPaymentService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly webhooks: WebhookService,
    @Inject('PAYMENT_GATEWAY') private readonly gateway: PaymentGateway,
  ) {}

  async simulate(
    playerId: string,
    reservationId: string,
    outcome: 'success' | 'failure' | 'pending',
    key: string,
  ) {
    if (
      !['development', 'test'].includes(process.env.NODE_ENV ?? '') ||
      !(this.gateway instanceof FakePaymentGateway)
    ) {
      throw new DomainError('NOT_FOUND', 'Test checkout is unavailable');
    }
    if (!key || key.length > 128)
      throw new DomainError('VALIDATION_FAILED', 'Idempotency-Key is required');
    const reservation = await this.prisma.reservation.findFirst({
      where: { id: reservationId, playerId },
      include: { payments: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    const payment = reservation?.payments[0];
    if (!reservation || !payment || !payment.gatewaySessionId.startsWith('fake-')) {
      throw new DomainError('NOT_FOUND', 'Booking not found');
    }
    const payload: PaymentWebhookPayload = {
      eventId: `local-checkout:${playerId}:${key}`,
      gatewaySessionId: payment.gatewaySessionId,
      gatewayTransactionId: `TEST-${payment.id}`,
      amountPiastres: payment.amountPiastres,
      currency: 'EGP',
      status: outcome === 'success' ? 'paid' : 'failed',
    };
    const existing = await this.prisma.webhookEvent.findUnique({
      where: { eventId: payload.eventId },
    });
    if (existing) {
      const previous = existing.rawPayload as unknown as PaymentWebhookPayload;
      if (
        previous.gatewaySessionId !== payload.gatewaySessionId ||
        previous.status !== payload.status ||
        previous.amountPiastres !== payload.amountPiastres
      ) {
        throw new DomainError(
          'IDEMPOTENCY_KEY_REUSED',
          'Idempotency key was reused with a different request',
        );
      }
    }
    if (payment.status === 'paid') return { outcome: 'success' as const, isTestPayment: true };
    if (
      reservation.status !== 'held' ||
      !reservation.holdExpiresAt ||
      reservation.holdExpiresAt <= new Date()
    ) {
      throw new DomainError('HOLD_EXPIRED', 'Slot hold expired.');
    }
    if (outcome === 'pending') return { outcome, isTestPayment: true };

    const raw = JSON.stringify(payload);
    const secret = process.env.FAKE_WEBHOOK_SECRET ?? 'local-webhook-secret';
    const signature = createHmac('sha256', secret).update(raw).digest('hex');
    const result = await this.webhooks.receive(payload, raw, signature, secret);
    if (!result.accepted && !result.duplicate)
      throw new DomainError('PAYMENT_NOT_CONFIRMED', 'Test payment could not be confirmed');
    if (outcome === 'success') this.gateway.markPaid(payment.gatewaySessionId);
    return { outcome, isTestPayment: true };
  }
}
