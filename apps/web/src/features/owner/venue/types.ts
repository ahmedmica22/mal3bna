import type { useOwnerVenuePage } from './hooks/useOwnerVenuePage';
export type OwnerVenueLoadingProps = Extract<
  ReturnType<typeof useOwnerVenuePage>,
  { view: 'Loading' }
>['props'];
export type OwnerVenuePendingProps = Extract<
  ReturnType<typeof useOwnerVenuePage>,
  { view: 'Pending' }
>['props'];
export type OwnerVenueOnboardingProps = Extract<
  ReturnType<typeof useOwnerVenuePage>,
  { view: 'Onboarding' }
>['props'];
export type OwnerVenueContentProps = Extract<
  ReturnType<typeof useOwnerVenuePage>,
  { view: 'Content' }
>['props'];
