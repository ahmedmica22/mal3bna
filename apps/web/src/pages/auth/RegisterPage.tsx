import { useRegisterPage } from '../../features/auth/register/hooks/useRegisterPage';
import { RegisterContent } from '../../features/auth/register/views/RegisterContent';

export function RegisterPage() {
  const state = useRegisterPage();
  switch (state.view) {
    case 'Content':
      return <RegisterContent {...state.props} />;
  }
}
