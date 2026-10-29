import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { authApi, setToken } from '../services/api';
import type { User } from '../types/domain';
type State = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
};
const Context = createContext<State | null>(null);
const channel =
  typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('mal3bna-account');
export function AuthStore({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    authApi
      .me()
      .then((data) => {
        if (active) setUser(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    const reset = () => {
      setToken(null);
      setUser(null);
      queryClient.clear();
    };
    channel?.addEventListener('message', reset);
    window.addEventListener('mal3bna-session-expired', reset);
    return () => {
      active = false;
      channel?.removeEventListener('message', reset);
      window.removeEventListener('mal3bna-session-expired', reset);
    };
  }, [queryClient]);
  const value = useMemo(
    () => ({
      user,
      loading,
      async signIn(email: string, password: string) {
        await authApi.login(email, password);
        queryClient.clear();
        const next = await authApi.me();
        setUser(next);
        channel?.postMessage('login');
        return next;
      },
      async signOut() {
        try {
          await authApi.logout();
        } finally {
          setUser(null);
          queryClient.clear();
          channel?.postMessage('logout');
        }
      },
    }),
    [loading, queryClient, user],
  );
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export const useAuth = () => {
  const value = useContext(Context);
  if (!value) throw new Error('useAuth must be used within AuthStore');
  return value;
};
