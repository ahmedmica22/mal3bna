import type { AuthScreenProps } from '../../features/auth/contracts';
import { useAuthScreen } from '../../features/auth/hooks/useAuthScreen';
import { AuthScreenContent } from '../../features/auth/views/AuthScreenContent';
export function AuthScreen(props: AuthScreenProps) {
  const state = useAuthScreen(props);
  switch (state.view) {
    case 'Content':
      return <AuthScreenContent {...state.props} />;
  }
}
