import type { CheckoutModalProps } from '../contracts';
export function useCheckoutModal(props: CheckoutModalProps) {
  if (!props.visible) return null;
  return { view: 'Content', props } as const;
}
