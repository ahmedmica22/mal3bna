import type { useEditVenueModal } from './hooks/useEditVenueModal';
export type EditVenueModalContentProps = Extract<
  ReturnType<typeof useEditVenueModal>,
  { view: 'Content' }
>['props'];
