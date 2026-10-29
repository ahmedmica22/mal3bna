import type { OwnerHeroBannerProps } from '../../features/owner/overview/contracts';
import { createOwnerHeroBannerModel } from '../../features/owner/overview/model/createOwnerHeroBannerModel';
import { OwnerHeroBannerContent } from '../../features/owner/overview/views/OwnerHeroBannerContent';
export function OwnerHeroBanner(props: OwnerHeroBannerProps) {
  const state = createOwnerHeroBannerModel(props);
  switch (state.view) {
    case 'Content':
      return <OwnerHeroBannerContent {...state.props} />;
  }
}
