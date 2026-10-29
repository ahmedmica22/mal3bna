import { request } from './http';

export const notificationApi = {
  inbox: () =>
    request<
      Array<{
        id: string;
        title: string;
        body: string;
        createdAt: string;
        readAt: string | null;
      }>
    >('/notifications'),
  markRead: (id: string) => request(`/notifications/${id}/read`, { method: 'POST' }),
  preferences: () =>
    request<
      Array<{
        category: string;
        emailEnabled: boolean;
        pushEnabled: boolean;
      }>
    >('/notifications/preferences'),
  setPreference: (category: string, emailEnabled: boolean, pushEnabled: boolean) =>
    request('/notifications/preferences', {
      method: 'POST',
      body: JSON.stringify({ category, emailEnabled, pushEnabled }),
    }),
};
