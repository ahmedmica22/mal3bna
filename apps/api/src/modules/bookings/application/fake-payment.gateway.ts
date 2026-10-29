import { Injectable } from '@nestjs/common';
import type { CheckoutRequest, CheckoutResult, PaymentGateway } from './payment-gateway';
@Injectable()
export class FakePaymentGateway implements PaymentGateway {
  private readonly sessions = new Map<string, CheckoutRequest>();
  private readonly paidSessions = new Set<string>();
  markPaid(sessionId: string) {
    this.paidSessions.add(sessionId);
  }
  async createCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
    const gatewaySessionId = `fake-${request.reservationId}`;
    this.sessions.set(gatewaySessionId, request);
    return {
      gatewaySessionId,
      checkoutUrl: `http://fake-payment.local/checkout/${gatewaySessionId}`,
    };
  }
  async verifyPayment(sessionId: string) {
    const request = this.sessions.get(sessionId);
    return {
      paid: this.paidSessions.has(sessionId),
      amountPiastres: request?.amountPiastres ?? 0,
      currency: 'EGP' as const,
    };
  }
  async refundPayment(request: {
    sessionId: string;
    amountPiastres: number;
    idempotencyKey: string;
  }) {
    return {
      refunded: Boolean(request.sessionId),
      gatewayRefundId: `fake-refund-${request.idempotencyKey}`,
    };
  }
}
