import { useLanguage } from '../../../../store/LanguageStore';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { authApi, request } from '../../../../services/api';

export function useVerifyPage() {
  const { translate } = useLanguage();
  const [params] = useSearchParams();
  const token = params.get('token');
  const email = params.get('email') ?? '';
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  async function verifyLink() {
    if (!token) return;
    setBusy(true);
    try {
      await request('/auth/verify-email', { method: 'POST', body: JSON.stringify({ token }) });
      setMessage('Email verified. You can sign in now.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Verification failed');
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    if (token) void verifyLink();
  }, [token]);
  async function resend() {
    try {
      await authApi.resendVerification(email);
      setMessage('A new verification email was sent.');
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message : 'Unable to resend verification.');
    }
  }
  return { view: 'Content', props: { busy, email, message, resend, token, translate } } as const;
}
