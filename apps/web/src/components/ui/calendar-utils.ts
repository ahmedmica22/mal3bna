export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

export const KICKOFF_HOURS = Array.from({ length: 17 }, (_, i) => {
  const h = i + 8;
  return `${String(h).padStart(2, '0')}:00`;
});

export function parseDateString(dateStr: string): { year: number; month: number; day: number } | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length < 3) return null;
  const year = parseInt(parts[0]!, 10);
  const month = parseInt(parts[1]!, 10) - 1; // 0-based
  const day = parseInt(parts[2]!, 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day };
}

export function parseDateTimeString(dtStr: string): {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
} | null {
  if (!dtStr) return null;
  const [datePart, timePart] = dtStr.split('T');
  if (!datePart) return null;
  const dParts = datePart.split('-');
  if (dParts.length < 3) return null;
  const year = parseInt(dParts[0]!, 10);
  const month = parseInt(dParts[1]!, 10) - 1;
  const day = parseInt(dParts[2]!, 10);

  let hour = 18;
  let minute = 0;
  if (timePart) {
    const tParts = timePart.split(':');
    hour = parseInt(tParts[0] ?? '18', 10);
    minute = parseInt(tParts[1] ?? '0', 10);
  }

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day, hour, minute };
}

export function formatDateString(year: number, month: number, day: number): string {
  const y = String(year).padStart(4, '0');
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export interface CalendarDayInfo {
  day: number;
  dateStr: string;
}

export function getMonthCalendarDays(year: number, month: number): {
  firstDayOfWeek: number;
  daysInMonth: number;
  days: CalendarDayInfo[];
} {
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: CalendarDayInfo[] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      dateStr: formatDateString(year, month, d),
    });
  }

  return { firstDayOfWeek, daysInMonth, days };
}
