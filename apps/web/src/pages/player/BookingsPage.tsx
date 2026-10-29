import { useBookingsPage } from '../../features/player/bookings/hooks/useBookingsPage';
import { BookingsContent } from '../../features/player/bookings/views/BookingsContent';

export function BookingsPage() {
  const state = useBookingsPage();
  switch (state.view) {
    case 'Content':
      return <BookingsContent {...state.props} />;
  }
}
