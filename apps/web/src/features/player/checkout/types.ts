import type { useCheckoutPage } from './hooks/useCheckoutPage';
export type CheckoutExpiredProps = Extract<
  ReturnType<typeof useCheckoutPage>,
  { view: 'Expired' }
>['props'];
export type CheckoutPaymentProps = Extract<
  ReturnType<typeof useCheckoutPage>,
  { view: 'Payment' }
>['props'];
export type CheckoutConfirmationProps = Extract<
  ReturnType<typeof useCheckoutPage>,
  { view: 'Confirmation' }
>['props'];
export type CheckoutContentProps = Extract<
  ReturnType<typeof useCheckoutPage>,
  { view: 'Content' }
>['props'];
