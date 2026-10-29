import type { createSettingsModalModel } from './model/createSettingsModalModel';
export type SettingsModalContentProps = Extract<
  ReturnType<typeof createSettingsModalModel>,
  { view: 'Content' }
>['props'];
