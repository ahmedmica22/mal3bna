import type { useProfilePage } from './hooks/useProfilePage';
export type ProfileLoadingProps = Extract<
  ReturnType<typeof useProfilePage>,
  { view: 'Loading' }
>['props'];
export type ProfileContentProps = Extract<
  ReturnType<typeof useProfilePage>,
  { view: 'Content' }
>['props'];
