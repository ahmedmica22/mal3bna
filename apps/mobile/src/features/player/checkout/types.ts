import type { useCheckoutModal } from './hooks/useCheckoutModal';
export type CheckoutModalContentProps = Extract<
  ReturnType<typeof useCheckoutModal>,
  { view: 'Content' }
>['props'];
