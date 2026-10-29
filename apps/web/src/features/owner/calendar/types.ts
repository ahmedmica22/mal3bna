import type { useOwnerCalendarPage } from './hooks/useOwnerCalendarPage';
export type OwnerCalendarLoadingProps = Extract<
  ReturnType<typeof useOwnerCalendarPage>,
  { view: 'Loading' }
>['props'];
export type OwnerCalendarErrorProps = Extract<
  ReturnType<typeof useOwnerCalendarPage>,
  { view: 'Error' }
>['props'];
export type OwnerCalendarContentProps = Extract<
  ReturnType<typeof useOwnerCalendarPage>,
  { view: 'Content' }
>['props'];
