import { useLanguage } from '../../../../store/LanguageStore';
import { FormEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../../../services/api';
import { useAuth } from '../../../../store/AuthStore';
import { useToast } from '../../../../components/feedback/ToastContext';

export function useRegisterPage() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [role, setRole] = useState<'player' | 'owner'>('player');
  const [fields, setFields] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await authApi.register({
        name: fields.name,
        email: fields.email,
        phone: fields.phone ? fields.phone.trim() : null,
        password: fields.password,
        role,
      });

      // Directly sign in without email verification roadblock
      const user = await signIn(fields.email, fields.password);
      toast.success(
        translate('Welcome to mal3bna, {{value0}}! Your account is ready.', { value0: user.name }),
        translate('Account Created'),
      );
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
        return;
      }
      navigate(user.role === 'owner' ? '/owner' : '/');
    } catch (cause) {
      const msg = cause instanceof Error ? cause.message : 'Unable to create account';
      setError(msg);
      toast.error(msg, translate('Registration Error'));
    } finally {
      setLoading(false);
    }
  }

  return {
    view: 'Content',
    props: { error, fields, loading, role, setFields, setRole, submit, translate },
  } as const;
}
