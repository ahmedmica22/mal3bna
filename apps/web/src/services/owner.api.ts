import type {
  Venue,
  OwnerBooking,
  OwnerBalance,
  OwnerProfileData,
  Payout,
  OccupancyReport,
} from '../types/domain';
import { request } from './http';

export const ownerApi = {
  mine: () => request<Venue>('/owner/venues/mine'),
  register: (body: unknown) =>
    request('/owner/venues', { method: 'POST', body: JSON.stringify(body) }),
  updateVenue: (venueId: string, body: unknown) =>
    request<Venue>('/owner/venues/' + venueId, { method: 'PATCH', body: JSON.stringify(body) }),
  uploadPhotos: (venueId: string, photos: Array<{ url: string; mimeType?: string }>) =>
    request('/owner/venues/' + venueId + '/photos', {
      method: 'POST',
      body: JSON.stringify({ photos }),
    }),
  submit: (venueId: string) => request(`/owner/venues/${venueId}/submit`, { method: 'POST' }),
  addCourt: (venueId: string, body: unknown) =>
    request(`/owner/venues/${venueId}/courts`, { method: 'POST', body: JSON.stringify(body) }),
  uploadCourtPhotos: (
    venueId: string,
    courtId: string,
    photos: Array<{ url: string; mimeType?: string }>,
  ) =>
    request('/owner/venues/' + venueId + '/courts/' + courtId + '/photos', {
      method: 'POST',
      body: JSON.stringify({ photos }),
    }),
  setOpeningHours: (venueId: string, dayOfWeek: number, openMinute: number, closeMinute: number) =>
    request(`/owner/venues/${venueId}/opening-hours`, {
      method: 'POST',
      body: JSON.stringify({ dayOfWeek, openMinute, closeMinute }),
    }),
  setPriceRules: (venueId: string, courtId: string, rules: unknown[]) =>
    request(`/owner/venues/${venueId}/courts/${courtId}/price-rules`, {
      method: 'POST',
      body: JSON.stringify({ rules }),
    }),
  bookings: (from?: string, to?: string) =>
    request<OwnerBooking[]>(`/owner/bookings${from ? `?from=${from}&to=${to}` : ''}`),
  arrive: (id: string) => request(`/owner/bookings/${id}/arrive`, { method: 'POST' }),
  collect: (id: string) => request(`/owner/bookings/${id}/collect`, { method: 'POST' }),
  complete: (id: string) => request(`/owner/bookings/${id}/complete`, { method: 'POST' }),
  reportNoShow: (id: string) => request(`/owner/bookings/${id}/no-show`, { method: 'POST' }),
  cancelBooking: (id: string, key?: string) =>
    request(`/owner/bookings/${id}/cancel`, {
      method: 'POST',
      headers: { 'Idempotency-Key': key || `owner-cancel-${id}-${Date.now()}` },
    }),
  manualBooking: (body: unknown) =>
    request('/owner/manual-bookings', { method: 'POST', body: JSON.stringify(body) }),
  blockCourt: (body: unknown) =>
    request('/owner/blocks', { method: 'POST', body: JSON.stringify(body) }),
  balance: () => request<OwnerBalance>('/owner/balance'),
  payouts: () => request<Payout[]>('/owner/payouts'),
  profile: () => request<OwnerProfileData>('/owner/profile'),
  updateProfile: (data: {
    photoUrl?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
  }) =>
    request<OwnerProfileData>('/owner/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  report: (from?: string, to?: string) =>
    request<OccupancyReport>(`/owner/reports/occupancy${from ? `?from=${from}&to=${to}` : ''}`),
};
