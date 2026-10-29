import { registerPush } from '../../../services/push.service';
import { useCallback, useEffect, useState } from 'react';
import { accountService } from '../../../services/account.service';
import { request, clearSession } from '../../../services/api';
import { errorMessage } from '../../../utils/errors';
export interface AccountCenterProps {
  visible: boolean;
  token: string | null;
  role: 'player' | 'owner';
  userName: string;
  onClose: () => void;
  onOpenBookings: () => void;
  onAccountChanged: () => Promise<void>;
  onSessionEnded: () => void;
}
type Data = {
  inbox: Awaited<ReturnType<typeof accountService.inbox>>;
  preferences: Awaited<ReturnType<typeof accountService.preferences>>;
  strikes: Awaited<ReturnType<typeof accountService.strikes>>;
  disputes: Awaited<ReturnType<typeof accountService.disputes>>;
  appeals: Awaited<ReturnType<typeof accountService.appeals>>;
};
export function useAccountCenter(props: AccountCenterProps) {
  const [tab, setTab] = useState<'inbox' | 'trust' | 'account'>('inbox');
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState(props.userName);
  const [phone, setPhone] = useState('');
  const [deleteText, setDeleteText] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [inbox, preferences, strikes, disputes, appeals] = await Promise.all([
        accountService.inbox(),
        accountService.preferences(),
        props.role === 'player' ? accountService.strikes() : [],
        props.role === 'player' ? accountService.disputes() : [],
        props.role === 'player' ? accountService.appeals() : [],
      ]);
      setData({ inbox, preferences, strikes, disputes, appeals });
    } catch (error) {
      setError(errorMessage(error, 'Could not load account information.'));
    } finally {
      setLoading(false);
    }
  }, [props.role, props.token]);
  useEffect(() => {
    setData(null);
    setName(props.userName);
    setDeleteText('');
    setCurrentPassword('');
    setPassword('');
    if (props.visible && props.token) void load();
  }, [props.visible, props.token, load, props.userName]);
  async function perform(action: () => Promise<unknown>, reload = true) {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      await action();
      if (reload) await load();
      return true;
    } catch (error) {
      setError(errorMessage(error, 'The action could not be saved.'));
      return false;
    } finally {
      setSaving(false);
    }
  }
  return {
    tab,
    setTab,
    data,
    loading,
    saving,
    error,
    message,
    setMessage,
    name,
    setName,
    phone,
    setPhone,
    deleteText,
    setDeleteText,
    currentPassword,
    setCurrentPassword,
    password,
    setPassword,
    reload: load,
    enablePush: () => perform(() => registerPush(), false),
    markRead: (id: string) => perform(() => accountService.read(id)),
    preference: (category: string, emailEnabled: boolean, pushEnabled: boolean) =>
      perform(() => accountService.preference({ category, emailEnabled, pushEnabled })),
    appeal: () =>
      perform(async () => {
        await accountService.appeal(message.trim());
        setMessage('');
      }),
    saveAccount: () =>
      perform(async () => {
        await request('/me', {
          method: 'PATCH',
          body: JSON.stringify({
            name: name.trim(),
            ...(phone.trim() ? { phone: phone.trim() } : {}),
          }),
        });
        await props.onAccountChanged();
      }, false),
    changePassword: () =>
      perform(async () => {
        await request('/auth/change-password', {
          method: 'POST',
          body: JSON.stringify({ currentPassword, password }),
        });
        await clearSession();
        props.onSessionEnded();
        props.onClose();
      }, false),
    deleteAccount: () =>
      perform(async () => {
        if (deleteText !== 'DELETE') return;
        await request('/me', { method: 'DELETE' });
        await clearSession();
        props.onSessionEnded();
        props.onClose();
      }, false),
  };
}
export type AccountCenterState = ReturnType<typeof useAccountCenter>;
