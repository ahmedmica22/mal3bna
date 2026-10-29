import type { useLoginPage } from './hooks/useLoginPage';
export type LoginContentProps = Extract<
  ReturnType<typeof useLoginPage>,
  { view: 'Content' }
>['props'];
