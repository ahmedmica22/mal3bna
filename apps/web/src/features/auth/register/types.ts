import type { useRegisterPage } from './hooks/useRegisterPage';
export type RegisterContentProps = Extract<
  ReturnType<typeof useRegisterPage>,
  { view: 'Content' }
>['props'];
