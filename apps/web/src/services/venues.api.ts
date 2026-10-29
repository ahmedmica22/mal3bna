import type { AvailabilitySlot, Venue } from '../types/domain';
import { request } from './http';

export const venueApi = {
  areas: () => request<Array<{ id: string; nameEn: string; nameAr: string }>>('/public/areas'),
  list: (query = '') => request<Venue[]>(`/public/venues${query}`),
  detail: (id: string) => request<Venue>(`/public/venues/${id}`),
  quote: (courtId: string, query: string) =>
    request<{
      totalPiastres: number;
      depositPiastres: number;
      dueAtVenuePiastres: number;
      breakdown: Array<{ hour: number; pricePiastres: number }>;
    }>(`/public/courts/${courtId}/quote${query}`),
  availability: (courtId: string, query: string) =>
    request<AvailabilitySlot[]>(`/public/courts/${courtId}/availability${query}`),
  checkin: (code: string) =>
    request<{
      id: string;
      bookingCode: string;
      status: string;
      customerName: string | null;
      customerPhone: string | null;
      startsAt: string;
      endsAt: string;
      courtName: string;
      venueName: string;
      dueAtVenuePiastres: number;
      alreadyArrived: boolean;
    }>(`/public/checkin/${encodeURIComponent(code)}`, { method: 'POST' }),
};
