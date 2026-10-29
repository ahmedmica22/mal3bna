import type { useAuthScreen } from './hooks/useAuthScreen';
export type AuthScreenContentProps = Extract<
  ReturnType<typeof useAuthScreen>,
  { view: 'Content' }
>['props'];
