import type { useBookingsPage } from './hooks/useBookingsPage';
export type BookingsContentProps = Extract<
  ReturnType<typeof useBookingsPage>,
  { view: 'Content' }
>['props'];
