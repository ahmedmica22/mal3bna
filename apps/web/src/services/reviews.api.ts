import { request } from './http';

export const reviewApi = {
  create: (reservationId: string, rating: number, comment?: string) =>
    request('/player/reviews', {
      method: 'POST',
      body: JSON.stringify({ reservationId, rating, comment }),
    }),
};
