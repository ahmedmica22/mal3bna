import type { useAdminDashboardPage } from './hooks/useAdminDashboardPage';
export type AdminDashboardLoadingProps = Extract<
  ReturnType<typeof useAdminDashboardPage>,
  { view: 'Loading' }
>['props'];
export type AdminDashboardContentProps = Extract<
  ReturnType<typeof useAdminDashboardPage>,
  { view: 'Content' }
>['props'];
