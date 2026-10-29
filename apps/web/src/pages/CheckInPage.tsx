import { useCheckInPage } from '../features/checkin/hooks/useCheckInPage';
import { CheckInContent } from '../features/checkin/views/CheckInContent';

export function CheckInPage() {
  const state = useCheckInPage();
  switch (state.view) {
    case 'Content':
      return <CheckInContent {...state.props} />;
  }
}
