import type { useHomePage } from './hooks/useHomePage';
export type HomeContentProps = Extract<
  ReturnType<typeof useHomePage>,
  { view: 'Content' }
>['props'];
