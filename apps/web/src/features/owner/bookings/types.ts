import type { useOwnerBookingsPage } from './hooks/useOwnerBookingsPage';
export type OwnerBookingsLoadingProps = Extract<
  ReturnType<typeof useOwnerBookingsPage>,
  { view: 'Loading' }
>['props'];
export type OwnerBookingsContentProps = Extract<
  ReturnType<typeof useOwnerBookingsPage>,
  { view: 'Content' }
>['props'];
