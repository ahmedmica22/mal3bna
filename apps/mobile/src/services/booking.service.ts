import { request } from './api';
import { Booking } from '../types/domain';

export interface CreateBookingDto {
  courtId: string;
  venueId: string;
  startsAt: string;
  hours: number;
  totalPiastres: number;
  depositPiastres: number;
  paymentOption: 'deposit' | 'full';
}

export const bookingService = {
  async getPlayerBookings(token: string | null): Promise<Booking[]> {
    if (!token) return [];
    return request<Booking[]>('/player/bookings', {}, token);
  },

  async createBooking(
    dto: CreateBookingDto,
    token: string | null,
    idempotencyKey: string,
  ): Promise<Booking & { bookingCode: string }> {
    if (!token) throw new Error('Authentication required to book a court');
    return await request<Booking & { bookingCode: string }>(
      '/player/bookings',
      {
        method: 'POST',
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(dto),
      },
      token,
    );
  },

  async confirmFakePayment(id: string, token: string | null) {
    return request<{ booking: Booking }>(
      `/player/bookings/${id}/fake-payment`,
      {
        method: 'POST',
        headers: { 'Idempotency-Key': `mobile-fake:${id}:success` },
        body: JSON.stringify({ outcome: 'success' }),
      },
      token,
    );
  },
  async cancelPreview(id: string, token: string | null) {
    return request<{ refundPiastres: number; retainedPiastres: number; reason: string }>(
      `/player/bookings/${id}/cancel-preview`,
      {},
      token,
    );
  },
  async cancelBooking(bookingId: string, token: string | null): Promise<void> {
    if (!token) throw new Error('Authentication required to cancel a booking');
    await request(
      `/player/bookings/${bookingId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Idempotency-Key': `mobile-cancel:${bookingId}`,
        },
      },
      token,
    );
  },
};
