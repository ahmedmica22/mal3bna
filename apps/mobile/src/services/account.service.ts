import { request } from './api';
import type {
  MobileNotification,
  NotificationPreference,
  PlayerStrike,
  PlayerDispute,
  PlayerAppeal,
  VenueReview,
  ReviewInput,
  DisputeInput,
  PreferenceInput,
} from '@court-booking/api-client';
export const accountService = {
  inbox: () => request<MobileNotification[]>('/notifications'),
  read: (id: string) =>
    request(`/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' }),
  preferences: () => request<NotificationPreference[]>('/notifications/preferences'),
  preference: (input: PreferenceInput) =>
    request('/notifications/preferences', { method: 'POST', body: JSON.stringify(input) }),
  strikes: () => request<PlayerStrike[]>('/player/strikes'),
  disputes: () => request<PlayerDispute[]>('/player/disputes'),
  dispute: (input: DisputeInput) =>
    request('/player/disputes', { method: 'POST', body: JSON.stringify(input) }),
  appeals: () => request<PlayerAppeal[]>('/player/appeals'),
  appeal: (message: string) =>
    request('/player/appeals', { method: 'POST', body: JSON.stringify({ message }) }),
  review: (input: ReviewInput) =>
    request('/player/reviews', { method: 'POST', body: JSON.stringify(input) }),
  reviews: (venueId: string) =>
    request<VenueReview[]>(`/public/venues/${encodeURIComponent(venueId)}/reviews`),
};
