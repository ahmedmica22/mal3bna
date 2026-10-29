import type { useAdminDisputesSection } from './hooks/useAdminDisputesSection';
export type AdminDisputesSectionLoadingProps = Extract<
  ReturnType<typeof useAdminDisputesSection>,
  { view: 'Loading' }
>['props'];
export type AdminDisputesSectionContentProps = Extract<
  ReturnType<typeof useAdminDisputesSection>,
  { view: 'Content' }
>['props'];
