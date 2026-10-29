import type { useOwnerProfilePage } from './hooks/useOwnerProfilePage';
export type OwnerProfileLoadingProps = Extract<
  ReturnType<typeof useOwnerProfilePage>,
  { view: 'Loading' }
>['props'];
export type OwnerProfileContentProps = Extract<
  ReturnType<typeof useOwnerProfilePage>,
  { view: 'Content' }
>['props'];
