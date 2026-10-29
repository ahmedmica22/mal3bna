import { useHomePage } from '../../features/player/discovery/hooks/useHomePage';
import { HomeContent } from '../../features/player/discovery/views/HomeContent';

export function HomePage() {
  const state = useHomePage();
  switch (state.view) {
    case 'Content':
      return <HomeContent {...state.props} />;
  }
}
