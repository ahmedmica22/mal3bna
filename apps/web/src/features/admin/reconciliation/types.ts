import type { useAdminStuckSection } from './hooks/useAdminStuckSection';
export type AdminStuckSectionLoadingProps = Extract<
  ReturnType<typeof useAdminStuckSection>,
  { view: 'Loading' }
>['props'];
export type AdminStuckSectionContentProps = Extract<
  ReturnType<typeof useAdminStuckSection>,
  { view: 'Content' }
>['props'];
