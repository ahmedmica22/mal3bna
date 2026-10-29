import type { useVenueDetailModal } from './hooks/useVenueDetailModal';
export type VenueDetailModalContentProps = Extract<
  ReturnType<typeof useVenueDetailModal>,
  { view: 'Content' }
>['props'];
