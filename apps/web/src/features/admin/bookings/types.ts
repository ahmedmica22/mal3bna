import type { useAdminBookingsPage } from './hooks/useAdminBookingsPage';
export type AdminBookingsLoadingProps = Extract<
  ReturnType<typeof useAdminBookingsPage>,
  { view: 'Loading' }
>['props'];
export type AdminBookingsErrorProps = Extract<
  ReturnType<typeof useAdminBookingsPage>,
  { view: 'Error' }
>['props'];
export type AdminBookingsContentProps = Extract<
  ReturnType<typeof useAdminBookingsPage>,
  { view: 'Content' }
>['props'];
