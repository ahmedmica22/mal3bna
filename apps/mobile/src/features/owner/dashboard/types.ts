import type { createOwnerDashboardScreenModel } from './model/createOwnerDashboardScreenModel';
export type OwnerDashboardScreenContentProps = Extract<
  ReturnType<typeof createOwnerDashboardScreenModel>,
  { view: 'Content' }
>['props'];
