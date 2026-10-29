import type { createPlayerProfileScreenModel } from './model/createPlayerProfileScreenModel';
export type PlayerProfileScreenContentProps = Extract<
  ReturnType<typeof createPlayerProfileScreenModel>,
  { view: 'Content' }
>['props'];
