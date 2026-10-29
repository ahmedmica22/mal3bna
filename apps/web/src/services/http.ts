import { SessionClient, type AuthResponse } from '@court-booking/api-client';

const session = new SessionClient({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1',
  refresh: async (transport) => {
    const result = await transport.request<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
    return result.accessToken;
  },
  onSessionExpired: () => window.dispatchEvent(new Event('mal3bna-session-expired')),
});
export const client = session.publicClient;
export const setToken = (value: string | null) => {
  session.setAccessToken(value);
};
export const getToken = () => session.getAccessToken();
export function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  return session.request<T>(path, init);
}
