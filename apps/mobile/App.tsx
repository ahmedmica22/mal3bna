import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppContent } from './src/features/app/hooks/useAppContent';
import { MobileAppView } from './src/features/app/views/MobileAppView';
export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}
function AppContent() {
  const state = useAppContent();
  switch (state.view) {
    case 'Content':
      return <MobileAppView {...state.props} />;
  }
}
