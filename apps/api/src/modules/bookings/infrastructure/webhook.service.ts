import { Inject, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { PaymentGateway } from '../application/payment-gateway';
import { LedgerService } from './ledger.service';

export interface PaymentWebhookPayload {
  eventId: string;
  gatewaySessionId: string;
  gatewayTransactionId?: string;
  amountPiastres: number;
  currency: 'EGP';
  status: 'paid' | 'failed';
  occurredAt?: string;
}

@Injectable()
export class WebhookService {
  constructor(
    private readonly prisma: PrismaClient,
    @Inject('PAYMENT_GATEWAY') private readonly gateway: PaymentGateway,
  ) {}

  verifySignature(payload: string, signature: string, secret: string): boolean {
    const expected = createHmac('sha256', secret).update(payload).digest('hex');
    const actual = Buffer.from(signature, 'utf8');
    const wanted = Buffer.from(expected, 'utf8');
    return actual.length === wanted.length && timingSafeEqual(actual, wanted);
  }

  async receive(
    payload: PaymentWebhookPayload,
    rawPayload: string,
    signature: string,
    secret: string,
  ) {
    const valid = this.verifySignature(rawPayload, signature, secret);
    const existing = await this.prisma.webhookEvent.findUnique({
      where: { eventId: payload.eventId },
    });
    if (existing) return { duplicate: true, status: existing.status };
    const event = await this.prisma.webhookEvent.create({
      data: {
        provider: 'fake',
        eventId: payload.eventId,
        rawPayload: payload as unknown as Prisma.InputJsonValue,
        signatureValid: valid,
        status: valid ? 'received' : 'failed',
      },
    });
    if (!valid) return { duplicate: false, accepted: false, status: event.status };
    const payment = await this.prisma.payment.findUnique({
      where: { gatewaySessionId: payload.gatewaySessionId },
      include: { reservation: true },
    });
    if (
      !payment ||
      payment.amountPiastres !== payload.amountPiastres ||
      payload.currency !== 'EGP'
    ) {
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: { status: 'failed' },
      });
      return { duplicate: false, accepted: false, status: 'failed' };
    }
    if (payment.status === 'paid' || payment.status === 'expired') {
      await this.prisma.webhookEvent.update({
        where: { id: event.id },
        data: { status: 'processed', processedAt: new Date() },
      });
      return { duplicate: false, accepted: true, status: 'processed', ignored: true };
    }
    if (payload.status === 'failed') {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'failed', method: 'fake' },
      });
    } else if (
      payment.reservation.status === 'held' &&
      payment.reservation.holdExpiresAt &&
      payment.reservation.holdExpiresAt > new Date()
    ) {
      await this.prisma.$transaction([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: 'paid',
            method: 'fake',
            paidAt: new Date(),
            ...(payload.gatewayTransactionId
              ? { gatewayTransactionId: payload.gatewayTransactionId }
              : {}),
          },
        }),
        this.prisma.reservation.update({
          where: { id: payment.reservationId },
          data: {
            status: 'confirmed',
            confirmedAt: new Date(),
            paidPiastres: payment.amountPiastres,
          },
        }),
        LedgerService.recordHeld(this.prisma, {
          reservationId: payment.reservationId,
          venueId: payment.reservation.venueId,
          paymentId: payment.id,
          amountPiastres: payment.amountPiastres,
        }),
        this.prisma.auditLog.create({
          data: {
            action: 'payment.confirmed',
            targetType: 'reservation',
            targetId: payment.reservationId,
            newValue: {
              paymentId: payment.id,
              amountPiastres: payment.amountPiastres,
              simulated: true,
            },
          },
        }),
      ]);
    } else {
      const refundKey = `late-webhook:${payload.eventId}`;
      await this.prisma.payment.update({ where: { id: payment.id }, data: { status: 'expired' } });
      const gatewayRefund = await this.gateway.refundPayment({
        sessionId: payment.gatewaySessionId,
        amountPiastres: payment.amountPiastres,
        idempotencyKey: refundKey,
      });
      const refund = await this.prisma.refund.create({
        data: {
          paymentId: payment.id,
          reservationId: payment.reservationId,
          amountPiastres: payment.amountPiastres,
          reason: 'late_payment',
          status: gatewayRefund.refunded ? 'succeeded' : 'failed',
          gatewayRefundId: gatewayRefund.gatewayRefundId,
          idempotencyKey: refundKey,
        },
      });
      if (refund.status === 'succeeded') {
        await LedgerService.recordRefund(this.prisma, {
          reservationId: payment.reservationId,
          venueId: payment.reservation.venueId,
          paymentId: payment.id,
          refundId: refund.id,
          amountPiastres: refund.amountPiastres,
        });
      }
    }
    await this.prisma.webhookEvent.update({
      where: { id: event.id },
      data: { status: 'processed', processedAt: new Date() },
    });
    return { duplicate: false, accepted: true, status: 'processed' };
  }

  async reconcilePendingPayments(now = new Date()) {
    const pending = await this.prisma.payment.findMany({
      where: { status: 'pending' },
      include: { reservation: true },
    });
    let processed = 0;
    for (const payment of pending) {
      const verified = await this.gateway.verifyPayment(payment.gatewaySessionId);
      if (!verified.paid) {
        if (payment.reservation.holdExpiresAt && payment.reservation.holdExpiresAt <= now) {
          await this.prisma.$transaction([
            this.prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'expired' },
            }),
            this.prisma.reservation.update({
              where: { id: payment.reservationId },
              data: { status: 'expired' },
            }),
          ]);
          processed += 1;
        }
        continue;
      }
      const payload: PaymentWebhookPayload = {
        eventId: `reconcile:${payment.id}:${payment.updatedAt.getTime()}`,
        gatewaySessionId: payment.gatewaySessionId,
        amountPiastres: verified.amountPiastres,
        currency: verified.currency,
        status: 'paid',
      };
      const raw = JSON.stringify(payload);
      const signature = createHmac('sha256', 'local-webhook-secret').update(raw).digest('hex');
      await this.receive(payload, raw, signature, 'local-webhook-secret');
      processed += 1;
    }
    return processed;
  }
}
