import type { useAdminPayoutsSection } from './hooks/useAdminPayoutsSection';
export type AdminPayoutsSectionLoadingProps = Extract<
  ReturnType<typeof useAdminPayoutsSection>,
  { view: 'Loading' }
>['props'];
export type AdminPayoutsSectionContentProps = Extract<
  ReturnType<typeof useAdminPayoutsSection>,
  { view: 'Content' }
>['props'];
