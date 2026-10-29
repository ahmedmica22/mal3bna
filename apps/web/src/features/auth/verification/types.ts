import type { useVerifyPage } from './hooks/useVerifyPage';
export type VerifyContentProps = Extract<
  ReturnType<typeof useVerifyPage>,
  { view: 'Content' }
>['props'];
