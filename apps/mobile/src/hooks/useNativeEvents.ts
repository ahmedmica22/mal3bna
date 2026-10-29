import { useEffect, useRef, useState } from 'react';
import type { NotificationResponse } from 'expo-notifications';
import { AppState, Linking, Platform } from 'react-native';
import Constants from 'expo-constants';
import { request } from '../services/api';
import { registerPush } from '../services/push.service';
import type { Booking } from '../types/domain';
import { errorMessage } from '../utils/errors';
interface Props {
  token: string | null;
  role: 'player' | 'owner';
  onPlayerBookings: () => void;
  onOwnerBookings: () => void;
  onInbox: () => void;
  onAccountRefresh: () => Promise<void>;
  onError: (message: string) => void;
  onVerified?: () => void;
}
export function useNativeEvents(props: Props) {
  const latest = useRef(props);
  latest.current = props;
  const pending = useRef<string | null>(null);
  const [online, setOnline] = useState(true);
  async function handle(value: string) {
    const p = latest.current;
    const path = value.startsWith('/')
      ? value
      : (() => {
          try {
            const url = new URL(value);
            if (!['courtapp:', 'exp:', 'exps:'].includes(url.protocol)) return '';
            return `${url.hostname}/${url.pathname.replace(/^\//, '')}${url.search}`;
          } catch {
            return '';
          }
        })();
    const clean = path.replace(/^\/?--\//, '/');
    if (!clean) return;
    if (/(?:^|\/)verify-email(?:\/|\?|$)/.test(clean)) {
      const token = new URLSearchParams(clean.split('?')[1] ?? '').get('token');
      if (token && token.length <= 1024) {
        try { await request('/auth/verify-email',{method:'POST',body:JSON.stringify({token})}); if(p.token) await p.onAccountRefresh(); p.onVerified?.(); }
        catch(error) { p.onError(errorMessage(error,'Could not verify email.')); }
      }
      return;
    }
    if (!p.token) {
      pending.current = value;
      return;
    }
    try {
      const id =
        clean.match(/(?:bookings?|payment-return)\/?([a-f0-9-]{36})/i)?.[1] ??
        clean.match(/[?&]bookingId=([a-f0-9-]{36})/i)?.[1];
      if (id) {
        if (p.role === 'player') {
          await request<Booking>(`/player/bookings/${id}`);
          p.onPlayerBookings();
        } else {
          const rows = await request<Booking[]>('/owner/bookings');
          if (!rows.some((row) => row.id === id)) throw new Error('Booking not found');
          p.onOwnerBookings();
        }
      } else if (/notifications|inbox|disputes|appeals|strikes/.test(clean)) p.onInbox();
    } catch (error) {
      p.onError(errorMessage(error, 'Could not open this link.'));
    }
  }
  useEffect(() => {
    void Linking.getInitialURL()
      .then((url) => {
        if (url) void handle(url);
      })
      .catch(() => undefined);
    const links = Linking.addEventListener('url', ({ url }) => void handle(url));
    let cleanupPush: (() => void) | undefined;
    let active = true;
    if (Platform.OS !== 'web' && Constants.executionEnvironment !== 'storeClient')
      void import('expo-notifications')
        .then(async (Notifications) => {
          if (!active) return;
          const open = (response: NotificationResponse | null) => {
            const data = response?.notification.request.content.data;
            const path = data?.link ?? data?.url;
            if (typeof path === 'string') void handle(path);
          };
          open(Notifications.getLastNotificationResponse());
          const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
            open(response);
            Notifications.clearLastNotificationResponse();
          });
          cleanupPush = () => subscription.remove();
        })
        .catch(() => undefined);
    const health = async () => {
      try {
        await request('/health');
        if (active) setOnline(true);
      } catch {
        if (active) setOnline(false);
      }
    };
    void health();
    const interval = setInterval(health, 30000);
    const state = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        void health();
        if (latest.current.token) void latest.current.onAccountRefresh().catch(() => undefined);
      }
    });
    return () => {
      active = false;
      links.remove();
      state.remove();
      cleanupPush?.();
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    if (props.token) {
      if (pending.current) {
        const value = pending.current;
        pending.current = null;
        void handle(value);
      }
      void registerPush(false).catch(() => undefined);
    }
  }, [props.token]);
  return { online };
}
