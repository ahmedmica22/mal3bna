import type { AvailabilitySlot } from '../types/domain';

/** Presentation selection only; the backend remains the reservation authority. */
export function consecutiveSlotCount(
  slots: AvailabilitySlot[],
  startsAt: string | null,
  limit: number,
): number {
  if (!startsAt) return 0;
  const available = new Set(
    slots
      .filter((slot) => slot.status === 'available' && slot.available !== false)
      .map((slot) => Date.parse(slot.startsAt)),
  );
  let count = 0;
  while (count < limit && available.has(Date.parse(startsAt) + count * 3_600_000)) count++;
  return count;
}

export interface SlotRun {
  startsAt: string;
  hours: number;
  totalPiastres: number;
  depositPiastres: number;
  dueAtVenuePiastres: number;
  slots: AvailabilitySlot[];
}

export function groupSlotsIntoRuns(slots: AvailabilitySlot[]): SlotRun[] {
  if (slots.length === 0) return [];
  const sorted = [...slots].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  const runs: SlotRun[] = [];
  let currentRun: AvailabilitySlot[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const prevTime = new Date(prev.startsAt).getTime();
    const currTime = new Date(curr.startsAt).getTime();

    // Check if slots are exactly 1 hour apart (consecutive)
    if (currTime === prevTime + 3_600_000) {
      currentRun.push(curr);
    } else {
      runs.push(makeRun(currentRun));
      currentRun = [curr];
    }
  }
  runs.push(makeRun(currentRun));
  return runs;
}

function makeRun(runSlots: AvailabilitySlot[]): SlotRun {
  const totalPiastres = runSlots.reduce((sum, s) => sum + (s.pricePiastres ?? 0), 0);
  const depositPiastres = Math.round(totalPiastres * 0.3);
  return {
    startsAt: runSlots[0].startsAt,
    hours: runSlots.length,
    totalPiastres,
    depositPiastres,
    dueAtVenuePiastres: totalPiastres - depositPiastres,
    slots: runSlots,
  };
}
