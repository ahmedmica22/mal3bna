import type { useAdminUsersSection } from './hooks/useAdminUsersSection';
export type AdminUsersSectionLoadingProps = Extract<
  ReturnType<typeof useAdminUsersSection>,
  { view: 'Loading' }
>['props'];
export type AdminUsersSectionContentProps = Extract<
  ReturnType<typeof useAdminUsersSection>,
  { view: 'Content' }
>['props'];
