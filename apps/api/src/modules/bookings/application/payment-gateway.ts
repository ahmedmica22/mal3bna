export interface CheckoutRequest {
  reservationId: string;
  amountPiastres: number;
  currency: 'EGP';
}
export interface CheckoutResult {
  checkoutUrl: string;
  gatewaySessionId: string;
}
export interface PaymentGateway {
  createCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
  verifyPayment(
    sessionId: string,
  ): Promise<{ paid: boolean; amountPiastres: number; currency: 'EGP' }>;
  refundPayment(request: {
    sessionId: string;
    amountPiastres: number;
    idempotencyKey: string;
  }): Promise<{ refunded: boolean; gatewayRefundId: string }>;
}
