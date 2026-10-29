export const VENUE_TIME_ZONE = 'Africa/Cairo';

export function venueDate(value: Date | string = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: VENUE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value));
}

export function venueHour(value: string | Date): number {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: VENUE_TIME_ZONE,
      hour: '2-digit',
      hourCycle: 'h23',
    }).format(new Date(value)),
  );
}

export function formatCairoHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}

export function getUpcomingDays(
  count = 7,
): Array<{ date: string; label: string; weekday: string }> {
  const days: Array<{ date: string; label: string; weekday: string }> = [];
  const base = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(base.getTime() + i * 86_400_000);
    const dateStr = venueDate(d);
    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: VENUE_TIME_ZONE,
      weekday: 'short',
    }).format(d);
    const monthDay = new Intl.DateTimeFormat('en-US', {
      timeZone: VENUE_TIME_ZONE,
      month: 'short',
      day: 'numeric',
    }).format(d);

    let label = monthDay;
    if (i === 0) label = 'Today';
    else if (i === 1) label = 'Tomorrow';

    days.push({ date: dateStr, label, weekday });
  }

  return days;
}
