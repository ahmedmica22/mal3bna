import type { PlayerProfile, Strike, Dispute, Appeal } from '../types/domain';
import { request } from './http';

export const trustApi = {
  profile: () => request<PlayerProfile>('/player/profile'),
  updateProfile: (body: unknown) =>
    request('/player/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  strikes: () => request<Strike[]>('/player/strikes'),
  disputes: () => request<Dispute[]>('/player/disputes'),
  createDispute: (reservationId: string, playerMessage: string) =>
    request('/player/disputes', {
      method: 'POST',
      body: JSON.stringify({ reservationId, playerMessage }),
    }),
  appeals: () => request<Appeal[]>('/player/appeals'),
  createAppeal: (message: string) =>
    request('/player/appeals', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};
