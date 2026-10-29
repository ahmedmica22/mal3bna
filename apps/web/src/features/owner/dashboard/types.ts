import type { useOwnerDashboardPage } from './hooks/useOwnerDashboardPage';
export type OwnerDashboardLoadingProps = Extract<
  ReturnType<typeof useOwnerDashboardPage>,
  { view: 'Loading' }
>['props'];
export type OwnerDashboardContentProps = Extract<
  ReturnType<typeof useOwnerDashboardPage>,
  { view: 'Content' }
>['props'];
