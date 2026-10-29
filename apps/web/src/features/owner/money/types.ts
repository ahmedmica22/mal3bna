import type { useOwnerMoneyPage } from './hooks/useOwnerMoneyPage';
export type OwnerMoneyLoadingProps = Extract<
  ReturnType<typeof useOwnerMoneyPage>,
  { view: 'Loading' }
>['props'];
export type OwnerMoneyErrorProps = Extract<
  ReturnType<typeof useOwnerMoneyPage>,
  { view: 'Error' }
>['props'];
export type OwnerMoneyContentProps = Extract<
  ReturnType<typeof useOwnerMoneyPage>,
  { view: 'Content' }
>['props'];
