import { CheckoutExpired } from '../../features/player/checkout/views/CheckoutExpired';
import { CheckoutPayment } from '../../features/player/checkout/views/CheckoutPayment';
import { useCheckoutPage } from '../../features/player/checkout/hooks/useCheckoutPage';
import { CheckoutConfirmation } from '../../features/player/checkout/views/CheckoutConfirmation';
import { CheckoutContent } from '../../features/player/checkout/views/CheckoutContent';

export function CheckoutPage() {
  const state = useCheckoutPage();
  switch (state.view) {
    case 'Expired':
      return <CheckoutExpired {...state.props} />;
    case 'Payment':
      return <CheckoutPayment {...state.props} />;
    case 'Confirmation':
      return <CheckoutConfirmation {...state.props} />;
    case 'Content':
      return <CheckoutContent {...state.props} />;
  }
}
