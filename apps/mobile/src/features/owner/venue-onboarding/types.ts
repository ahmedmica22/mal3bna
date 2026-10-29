import type { useOwnerAddVenueScreen } from './hooks/useOwnerAddVenueScreen';
export type OwnerAddVenueScreenContentProps = Extract<
  ReturnType<typeof useOwnerAddVenueScreen>,
  { view: 'Content' }
>['props'];
