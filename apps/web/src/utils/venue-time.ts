export const VENUE_TIME_ZONE = 'Africa/Cairo';

export function venueDate(value: Date | string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: VENUE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export function venueHour(value: string): number {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: VENUE_TIME_ZONE,
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(new Date(value)),
  );
}

/** Match every occupied hour, including reservations crossing midnight. */
export function occupiesVenueHour(start: string, end: string, date: string, hour: number): boolean {
  for (let instant = Date.parse(start); instant < Date.parse(end); instant += 3_600_000) {
    const value = new Date(instant).toISOString();
    if (venueDate(value) === date && venueHour(value) === hour) return true;
  }
  return false;
}
