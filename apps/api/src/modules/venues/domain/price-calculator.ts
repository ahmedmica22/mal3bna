import type { PriceRule } from './venue.types';

export interface HourPrice {
  startsAt: Date;
  endsAt: Date;
  pricePiastres: number;
}

export function calculatePrice(
  rules: PriceRule[],
  startsAt: Date,
  hours: number,
  timeZone: string,
  now = new Date(),
): HourPrice[] {
  if (!Number.isInteger(hours) || hours < 1) throw new Error('Hours must be a positive integer');
  const result: HourPrice[] = [];
  for (let index = 0; index < hours; index += 1) {
    const start = new Date(startsAt.getTime() + index * 3_600_000);
    const end = new Date(start.getTime() + 3_600_000);
    const local = localMinute(start, timeZone);
    const matchingRules = rules.filter(
      (candidate) =>
        candidate.dayOfWeek === local.day &&
        candidate.startMinute <= local.minute &&
        local.minute < candidate.endMinute,
    );
    let rule = matchingRules.find(
      (candidate) =>
        candidate.validFrom <= now && (candidate.validTo === null || now < candidate.validTo),
    );
    if (!rule && matchingRules.length > 0) {
      // Fallback to configured rule for newly created courts so slots are immediately viewable
      rule = matchingRules[0];
    }
    if (!rule) throw new Error(`No active price rule for hour ${start.toISOString()}`);
    result.push({ startsAt: start, endsAt: end, pricePiastres: rule.pricePiastres });
  }
  return result;
}

const localMinuteFormatterCache = new Map<string, Intl.DateTimeFormat>();

function getLocalMinuteFormatter(timeZone: string): Intl.DateTimeFormat {
  let formatter = localMinuteFormatterCache.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    localMinuteFormatterCache.set(timeZone, formatter);
  }
  return formatter;
}

function localMinute(date: Date, timeZone: string): { day: number; minute: number } {
  const parts = getLocalMinuteFormatter(timeZone).formatToParts(date);
  const weekday = parts.find((part) => part.type === 'weekday')?.value ?? 'Sun';
  const hour = Number(parts.find((part) => part.type === 'hour')?.value ?? 0) % 24;
  const minute = Number(parts.find((part) => part.type === 'minute')?.value ?? 0);
  return {
    day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekday),
    minute: hour * 60 + minute,
  };
}
