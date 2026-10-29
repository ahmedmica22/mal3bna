import { unregisterPush } from '../services/push.service';
import { useEffect, useState } from 'react';
import type { PublicUserResponse } from '@court-booking/api-client';
import {
  accessToken,
  authenticate,
  clearSession,
  endSession,
  request,
  restoreSession,
  subscribeSession,
} from '../services/api';
import { errorMessage } from '../utils/errors';
export function useAuth(
  onToast?: (type: 'success' | 'error' | 'warning' | 'info', title: string, msg: string) => void,
) {
  const [token, setToken] = useState<string | null>(accessToken());
  const [account, setAccount] = useState<PublicUserResponse | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [restoring, setRestoring] = useState(true);
  const [sessionError, setSessionError] = useState('');
  function apply(user: PublicUserResponse | null) {
    setAccount(user);
    setToken(accessToken());
  }
  async function restore() {
    setRestoring(true);
    setSessionError('');
    try {
      apply(await restoreSession());
    } catch (error) {
      setSessionError(errorMessage(error, 'Could not restore your session.'));
    } finally {
      setRestoring(false);
    }
  }
  useEffect(() => {
    void restore();
    return subscribeSession(() => {
      const next = accessToken();
      setToken(next);
      if (!next) setAccount(null);
    });
  }, []);
  async function login(email: string, password: string) {
    setSessionError('');
    setIsLoggingIn(true);
    try {
      apply(await authenticate({ email: email.trim(), password }));
    } catch (error) {
      onToast?.('error', 'Sign in', errorMessage(error, 'Could not sign in.'));
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  }
  async function register(params: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    role?: 'player';
  }) {
    setIsLoggingIn(true);
    try {
      await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ ...params, role: 'player' }),
      });
      await login(params.email, params.password);
    } finally {
      setIsLoggingIn(false);
    }
  }
  async function refreshMe() {
    if (accessToken()) apply(await request<PublicUserResponse>('/me'));
  }
  async function logout() {
    try {
      try {
        await unregisterPush();
      } catch {
        /* Logout must still clear the session when offline. */
      }
      await endSession();
    } catch (error) {
      onToast?.('warning', 'Signed out', errorMessage(error, 'Local session cleared.'));
    } finally {
      apply(null);
    }
  }
  async function updateProfile(data: { name?: string; phone?: string | null }) {
    if (!accessToken()) return;
    try {
      const updated = await request<PublicUserResponse>('/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      apply(updated);
      onToast?.('success', 'Profile Updated', 'Your profile details have been saved.');
      return updated;
    } catch (error) {
      onToast?.('error', 'Update Failed', errorMessage(error, 'Could not update profile.'));
      throw error;
    }
  }
  async function deleteAccount() {
    await request('/me', { method: 'DELETE' });
    await clearSession();
    apply(null);
  }
  return {
    token,
    account,
    restoring,
    sessionError,
    retrySession: restore,
    userRole: (account?.role === 'owner' ? 'owner' : 'player') as 'player' | 'owner',
    userStatus: account?.status ?? 'active',
    userName: account?.name ?? '',
    userPhone: account?.phone ?? '',
    updateProfile,
    isLoggingIn,
    login,
    register,
    refreshMe,
    logout,
    deleteAccount,
    toggleRole: () => onToast?.('info', 'Account role', account?.role ?? 'Visitor'),
  };
}
