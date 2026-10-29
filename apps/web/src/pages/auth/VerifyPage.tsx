import { useVerifyPage } from '../../features/auth/verification/hooks/useVerifyPage';
import { VerifyContent } from '../../features/auth/verification/views/VerifyContent';

export function VerifyPage() {
  const state = useVerifyPage();
  switch (state.view) {
    case 'Content':
      return <VerifyContent {...state.props} />;
  }
}
