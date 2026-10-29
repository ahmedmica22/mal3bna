import type { CheckoutModalProps } from '../../features/player/checkout/contracts';
import { useCheckoutModal } from '../../features/player/checkout/hooks/useCheckoutModal';
import { CheckoutModalContent } from '../../features/player/checkout/views/CheckoutModalContent';
export function CheckoutModal(props: CheckoutModalProps) {
  const state = useCheckoutModal(props);
  if (!state) return null;
  switch (state.view) {
    case 'Content':
      return <CheckoutModalContent {...state.props} />;
  }
}
