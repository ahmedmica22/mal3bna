import type { Booking } from '../types/domain';
import { request } from './http';

export const bookingApi = {
  fakePayment: (id: string, outcome: 'success' | 'failure' | 'pending', key: string) =>
    request<{ outcome: 'success' | 'failure' | 'pending'; isTestPayment: true; booking: Booking }>(
      `/player/bookings/${id}/fake-payment`,
      { method: 'POST', headers: { 'Idempotency-Key': key }, body: JSON.stringify({ outcome }) },
    ),
  list: () => request<Booking[]>('/player/bookings'),
  create: (body: unknown, key: string) =>
    request<Booking>('/player/bookings', {
      method: 'POST',
      headers: { 'Idempotency-Key': key },
      body: JSON.stringify(body),
    }),
  get: (id: string) => request<Booking>(`/player/bookings/${id}`),
  cancelPreview: (id: string) =>
    request<{ refundPiastres: number; forfeitDeposit?: boolean; message: string }>(
      `/player/bookings/${id}/cancel-preview`,
    ),
  cancel: (id: string, key: string) =>
    request(`/player/bookings/${id}/cancel`, {
      method: 'POST',
      headers: { 'Idempotency-Key': key },
      body: JSON.stringify({}),
    }),
};
