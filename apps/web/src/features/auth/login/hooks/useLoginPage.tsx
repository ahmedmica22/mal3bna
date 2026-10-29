import { useLanguage } from '../../../../store/LanguageStore';
import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../store/AuthStore';
import { useToast } from '../../../../components/feedback/ToastContext';

export function useLoginPage() {
  const { translate } = useLanguage();
  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await signIn(email, password);
      toast.success(
        translate('Welcome back, {{value0}}!', { value0: user.name }),
        translate('Signed In'),
      );
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
        return;
      }
      navigate(
        (location.state as { from?: string } | null)?.from ??
          (user.role === 'owner' ? '/owner' : user.role === 'admin' ? '/admin' : '/'),
      );
    } catch (cause) {
      const msg = cause instanceof Error ? cause.message : 'Unable to sign in';
      setError(msg);
      toast.error(msg, translate('Sign In Error'));
    } finally {
      setLoading(false);
    }
  }

  return {
    view: 'Content',
    props: { email, error, loading, password, setEmail, setPassword, submit, translate },
  } as const;
}
