import type { useManagePhotosModal } from './hooks/useManagePhotosModal';
export type ManagePhotosModalContentProps = Extract<
  ReturnType<typeof useManagePhotosModal>,
  { view: 'Content' }
>['props'];
