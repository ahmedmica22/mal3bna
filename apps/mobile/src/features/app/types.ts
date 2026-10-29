import type { useAppContent } from './hooks/useAppContent';
export type MobileAppViewProps = Extract<
  ReturnType<typeof useAppContent>,
  { view: 'Content' }
>['props'];
