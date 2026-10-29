import type { useVenuePage } from './hooks/useVenuePage';
export type VenueLoadingProps = Extract<
  ReturnType<typeof useVenuePage>,
  { view: 'Loading' }
>['props'];
export type VenueUnavailableProps = Extract<
  ReturnType<typeof useVenuePage>,
  { view: 'Unavailable' }
>['props'];
export type VenueContentProps = Extract<
  ReturnType<typeof useVenuePage>,
  { view: 'Content' }
>['props'];
