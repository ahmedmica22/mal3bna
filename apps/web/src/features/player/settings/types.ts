import type { useSettingsPage } from './hooks/useSettingsPage';
export type SettingsContentProps = Extract<
  ReturnType<typeof useSettingsPage>,
  { view: 'Content' }
>['props'];
