import type { createOwnerHeroBannerModel } from './model/createOwnerHeroBannerModel';
export type OwnerHeroBannerContentProps = Extract<
  ReturnType<typeof createOwnerHeroBannerModel>,
  { view: 'Content' }
>['props'];
