import { useLanguage } from '../../../../store/LanguageStore';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ownerApi } from '../../../../services/api';
import type { OwnerBooking } from '../../../../types/domain';
import { venueDate } from '../../../../utils/venue-time';

export function useOwnerCalendarPage() {
  const { translate, locale } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(() => venueDate(new Date()));
  const [inspectedBooking, setInspectedBooking] = useState<OwnerBooking | null>(null);

  const venueQuery = useQuery({
    queryKey: ['owner-venue'],
    queryFn: () => ownerApi.mine(),
  });

  // Fetch a surrounding UTC window, then place records by their venue-local date.
  const fromDate = new Date(Date.parse(`${selectedDate}T00:00:00Z`) - 86_400_000).toISOString();
  const toDate = new Date(Date.parse(`${selectedDate}T00:00:00Z`) + 86_400_000).toISOString();

  const bookingsQuery = useQuery({
    queryKey: ['owner-bookings', selectedDate],
    queryFn: () => ownerApi.bookings(fromDate, toDate),
    refetchInterval: 4000,
  });

  // Hours: 08:00 to 23:00 (16 hours)
  const hours = Array.from({ length: 24 }, (_, index) => index);

  if (venueQuery.isLoading || bookingsQuery.isLoading)
    return { view: 'Loading', props: { translate } } as const;
  if (venueQuery.isError || bookingsQuery.isError) {
    return { view: 'Error', props: { bookingsQuery, translate } } as const;
  }

  const venue = venueQuery.data;
  const bookings = bookingsQuery.data ?? [];
  const courts = venue?.courts ?? [];

  return {
    view: 'Content',
    props: {
      bookings,
      courts,
      hours,
      inspectedBooking,
      locale,
      selectedDate,
      setInspectedBooking,
      setSelectedDate,
      translate,
      venue,
    },
  } as const;
}
