import type { useAdminVenuesPage } from './hooks/useAdminVenuesPage';
export type AdminVenuesLoadingProps = Extract<
  ReturnType<typeof useAdminVenuesPage>,
  { view: 'Loading' }
>['props'];
export type AdminVenuesErrorProps = Extract<
  ReturnType<typeof useAdminVenuesPage>,
  { view: 'Error' }
>['props'];
export type AdminVenuesContentProps = Extract<
  ReturnType<typeof useAdminVenuesPage>,
  { view: 'Content' }
>['props'];
