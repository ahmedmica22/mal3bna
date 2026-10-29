import { useState } from 'react';
import { ApiError } from '@court-booking/api-client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../../../store/LanguageStore';
import { authApi, ownerApi } from '../../../../services/api';
import { venueDate } from '../../../../utils/venue-time';
import { onScheduleDate, shiftDate, summarizeVenue } from '../model/venue-dashboard';

export function useOwnerDashboardPage() {
  const { translate, locale } = useLanguage();
  const [scheduleDate, setScheduleDate] = useState(() => venueDate(new Date()));
  const [courtFilter, setCourtFilter] = useState('all');
  const meQuery = useQuery({ queryKey: ['me'], queryFn: () => authApi.me() });
  const profileQuery = useQuery({ queryKey: ['owner-profile'], queryFn: () => ownerApi.profile() });
  const venueQuery = useQuery({ queryKey: ['owner-venue'], queryFn: () => ownerApi.mine() });
  const bookingsQuery = useQuery({ queryKey: ['owner-bookings'], queryFn: () => ownerApi.bookings(), refetchInterval: 5000 });
  const balanceQuery = useQuery({ queryKey: ['owner-balance'], queryFn: () => ownerApi.balance(), refetchInterval: 15000 });

  function refresh() {
    void venueQuery.refetch();
    void bookingsQuery.refetch();
    void balanceQuery.refetch();
  }
  if (venueQuery.isPending || bookingsQuery.isPending) return { view: 'Loading', props: { translate } } as const;
  const venueMissing = venueQuery.error instanceof ApiError && venueQuery.error.status === 404;
  if ((venueQuery.isError && !venueMissing) || bookingsQuery.isError) {
    return { view: 'Error', props: { translate, refresh } } as const;
  }
  const venue = venueQuery.data;
  const bookings = bookingsQuery.data ?? [];
  const courts = venue?.courts ?? [];
  const now = new Date();
  const stats = summarizeVenue(bookings, courts, now);
  const displayBookings = bookings
    .filter((booking) => onScheduleDate(booking, scheduleDate) && (courtFilter === 'all' || booking.courtId === courtFilter))
    .sort((a, b) => Date.parse(a.startsAt) - Date.parse(b.startsAt));
  const todayCashDue = bookings.filter((booking) => booking.kind !== 'block' && onScheduleDate(booking, venueDate(now)) && ['confirmed', 'arrived', 'completed'].includes(booking.status))
    .reduce((total, booking) => total + (booking.dueAtVenuePiastres ?? booking.amountDuePiastres ?? 0), 0);
  const money = (piastres: number | undefined) => piastres === undefined ? '—' : new Intl.NumberFormat(locale, { style: 'currency', currency: 'EGP', maximumFractionDigits: 2 }).format(piastres / 100);
  const formatNumber = (value: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(value);
  const time = (value: string) => new Intl.DateTimeFormat(locale, { timeZone: 'Africa/Cairo', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(value));
  const dayLabel = (value: string, short = false) => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', weekday: short ? 'short' : 'long', ...(!short ? { month: 'long', day: 'numeric' } as const : {}) }).format(new Date(`${value}T12:00:00Z`));

  return {
    view: 'Content', props: {
      translate, locale, venue, profile: profileQuery.data, meQuery, venueQuery,
      stats, courts, balance: balanceQuery.data, balanceLoading: balanceQuery.isPending,
      balanceError: balanceQuery.isError, retryBalance: () => { void balanceQuery.refetch(); },
      hasTestPayments: bookings.some((booking) => booking.isTestPayment),
      todayCashDue, money, formatNumber, time, dayLabel,
      scheduleDate, setScheduleDate, courtFilter, setCourtFilter, displayBookings,
      previousDay: () => setScheduleDate((date) => shiftDate(date, -1)),
      nextDay: () => setScheduleDate((date) => shiftDate(date, 1)),
      goToday: () => setScheduleDate(venueDate(new Date())),
      today: venueDate(now), refresh,
      refreshing: venueQuery.isFetching || bookingsQuery.isFetching || balanceQuery.isFetching,
      staleData: venueQuery.isRefetchError || bookingsQuery.isRefetchError,
    },
  } as const;
}
