import type { User } from '../types/domain';
import { request, client, setToken } from './http';
import type { AuthResponse } from '@court-booking/api-client';

export const authApi = {
  updateProfile: (body: { name?: string; phone?: string | null; language?: 'en' | 'ar' }) =>
    request<User>('/me', { method: 'PATCH', body: JSON.stringify(body) }),
  updateLanguage: (language: 'en' | 'ar') =>
    request<User>('/me', { method: 'PATCH', body: JSON.stringify({ language }) }),
  login: async (email: string, password: string) => {
    const result = await client.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(result.accessToken);
    return result;
  },
  register: (body: unknown) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  resendVerification: (email: string) =>
    request('/auth/resend-verification', { method: 'POST', body: JSON.stringify({ email }) }),
  me: () => request<User>('/me'),
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      setToken(null);
    }
  },
  deleteAccount: async () => {
    await request('/me', { method: 'DELETE' });
    setToken(null);
  },
};
