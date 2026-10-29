import type { Court, OwnerBooking } from '../../../../types/domain';
import { venueDate } from '../../../../utils/venue-time';

const reservedStatuses = new Set(['confirmed', 'arrived', 'completed']);
const inactiveStatuses = new Set(['cancelled', 'expired']);

export function shiftDate(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

export function onScheduleDate(booking: OwnerBooking, date: string): boolean {
  return !inactiveStatuses.has(booking.status) &&
    venueDate(booking.startsAt) <= date &&
    venueDate(new Date(Date.parse(booking.endsAt) - 1)) >= date;
}

const hours = (booking: OwnerBooking) =>
  Math.max(0, (Date.parse(booking.endsAt) - Date.parse(booking.startsAt)) / 3_600_000);

/** Operational presentation totals only. Financial values come directly from the balance API. */
export function summarizeVenue(bookings: OwnerBooking[], courts: Court[], now: Date) {
  const games = bookings.filter((booking) => booking.kind !== 'block');
  const reserved = games.filter((booking) => reservedStatuses.has(booking.status));
  const today = venueDate(now);
  const week = Array.from({ length: 7 }, (_, index) => ({
    date: shiftDate(today, index - 6),
    hours: 0,
  }));
  const days = new Map(week.map((day) => [day.date, day]));
  for (const booking of reserved) {
    for (let instant = Date.parse(booking.startsAt); instant < Date.parse(booking.endsAt); instant += 3_600_000) {
      const day = days.get(venueDate(new Date(instant)));
      if (day) day.hours += Math.min(1, (Date.parse(booking.endsAt) - instant) / 3_600_000);
    }
  }
  return {
    totalBookings: games.length,
    completedBookings: games.filter((booking) => booking.status === 'completed').length,
    cancelledBookings: games.filter((booking) => booking.status === 'cancelled').length,
    reservedHours: reserved.reduce((total, booking) => total + hours(booking), 0),
    activeCourts: courts.filter((court) => court.isActive !== false && court.approvalStatus === 'approved').length,
    totalCourts: courts.length,
    todayBookings: games.filter((booking) => onScheduleDate(booking, today)).length,
    upcomingBookings: games.filter((booking) => ['held', 'confirmed', 'arrived'].includes(booking.status) && Date.parse(booking.endsAt) > now.getTime()).length,
    week,
    courtSummaries: courts.map((court) => {
      const matches = games.filter((booking) => booking.courtId === court.id);
      return {
        court,
        bookings: matches.length,
        hours: matches.filter((booking) => reservedStatuses.has(booking.status)).reduce((total, booking) => total + hours(booking), 0),
      };
    }),
  };
}
