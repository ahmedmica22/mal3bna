import { useLoginPage } from '../../features/auth/login/hooks/useLoginPage';
import { LoginContent } from '../../features/auth/login/views/LoginContent';

export function LoginPage() {
  const state = useLoginPage();
  switch (state.view) {
    case 'Content':
      return <LoginContent {...state.props} />;
  }
}
