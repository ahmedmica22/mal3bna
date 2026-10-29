import { accountService } from '../../../../services/account.service';
import { groupSlotsIntoRuns, type SlotRun } from '../../../../utils/slots';
import { useEffect, useMemo, useState } from 'react';
import type { VenueDetailModalProps } from '../contracts';
import type { AvailabilitySlot } from '../../../../types/domain';
import { venueService } from '../../../../services/venue.service';
import { getUpcomingDays, venueDate } from '../../../../utils/venue-time';

export function useVenueDetailModal({
  venue,
  selectedCourt,
  onSelectCourt,
  onProceedToCheckout,
  onClose,
}: VenueDetailModalProps) {
  const [reviews, setReviews] = useState<Awaited<ReturnType<typeof accountService.reviews>>>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(false);

  useEffect(() => {
    let active = true;
    setReviews([]);
    setReviewsError(false);
    if (!venue) return;
    setReviewsLoading(true);
    accountService
      .reviews(venue.id)
      .then((rows) => {
        if (active) setReviews(rows);
      })
      .catch(() => {
        if (active) setReviewsError(true);
      })
      .finally(() => {
        if (active) setReviewsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [venue?.id]);

  const upcomingDays = useMemo(() => getUpcomingDays(30), []);
  const [selectedDate, setSelectedDate] = useState(() => venueDate());
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<AvailabilitySlot[]>([]);

  const activeCourt = selectedCourt ?? venue?.courts?.[0] ?? null;
  const courtId = activeCourt?.id;

  useEffect(() => {
    setSelectedSlots([]);
    setLoadingSlots(true);
  }, [selectedDate, courtId]);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    let timer: ReturnType<typeof setTimeout> | undefined;
    setSlots([]);
    setLoadingSlots(true);
    setError(false);
    if (!courtId || !venue) {
      setLoadingSlots(false);
      return;
    }
    async function load(isBackground = false) {
      if (!isBackground) setLoadingSlots(true);
      try {
        const data = await venueService.getAvailability(courtId!, selectedDate, controller.signal);
        if (active) {
          setSlots(data);
          setError(false);
          // Clean up any selected slots that are no longer available
          setSelectedSlots((prev) =>
            prev.filter((p) => {
              const fresh = data.find((d) => d.startsAt === p.startsAt);
              return fresh && fresh.status === 'available' && fresh.available !== false;
            }),
          );
        }
      } catch {
        if (active) {
          setError(true);
          setSlots([]);
        }
      } finally {
        if (active) {
          setLoadingSlots(false);
          // Schedule after completion so slow networks never stack polling requests.
          timer = setTimeout(() => void load(true), 3000);
        }
      }
    }
    void load(false);
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      controller.abort();
    };
  }, [courtId, selectedDate, venue?.id]);

  const runs: SlotRun[] = useMemo(() => groupSlotsIntoRuns(selectedSlots), [selectedSlots]);

  const totalPiastres = useMemo(
    () => selectedSlots.reduce((sum, s) => sum + (s.pricePiastres ?? 0), 0),
    [selectedSlots],
  );
  const depositPiastres = Math.round(totalPiastres * 0.3);
  const dueAtVenuePiastres = totalPiastres - depositPiastres;

  const maxSlots = Math.min(venue?.maxHoursPerBooking ?? 4, 4);

  function toggleSlot(slot: AvailabilitySlot) {
    if (slot.status !== 'available' || slot.available === false) return;
    setSelectedSlots((prev) => {
      // 1. If nothing is selected, select this slot
      if (prev.length === 0) {
        return [slot];
      }

      // 2. If the clicked slot is already selected:
      const exists = prev.some((s) => s.startsAt === slot.startsAt);
      if (exists) {
        if (prev.length === 1) {
          return [];
        }
        if (prev[0]?.startsAt === slot.startsAt) {
          return prev.slice(1);
        }
        if (prev[prev.length - 1]?.startsAt === slot.startsAt) {
          return prev.slice(0, -1);
        }
        const idx = prev.findIndex((s) => s.startsAt === slot.startsAt);
        return prev.slice(0, idx);
      }

      // 3. Sequential additions:
      const firstSlot = prev[0];
      const lastSlot = prev[prev.length - 1];

      // Immediately after the current range
      if (lastSlot && lastSlot.endsAt === slot.startsAt) {
        if (prev.length < maxSlots) {
          return [...prev, slot];
        }
        return prev;
      }

      // Immediately before the current range
      if (firstSlot && slot.endsAt === firstSlot.startsAt) {
        if (prev.length < maxSlots) {
          return [slot, ...prev];
        }
        return prev;
      }

      // Tapping ahead (e.g. choose start and end for up to 4 sequential slots)
      const sortedAll = [...slots].sort(
        (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
      );
      const firstIdx = sortedAll.findIndex((s) => s.startsAt === firstSlot?.startsAt);
      const targetIdx = sortedAll.findIndex((s) => s.startsAt === slot.startsAt);

      if (firstIdx !== -1 && targetIdx !== -1 && targetIdx > firstIdx) {
        const span = targetIdx - firstIdx + 1;
        if (span <= maxSlots) {
          const candidateRange = sortedAll.slice(firstIdx, targetIdx + 1);
          const isValidChain = candidateRange.every((s, i) => {
            const isAvail = s.status === 'available' && s.available !== false;
            if (!isAvail) return false;
            if (i > 0) {
              const prevItem = candidateRange[i - 1];
              return prevItem && s.startsAt === prevItem.endsAt;
            }
            return true;
          });

          if (isValidChain) {
            return candidateRange;
          }
        }
      }

      // Distant click or non-contiguous gap begins a new sequential range
      return [slot];
    });
  }

  const eligible = selectedSlots.length > 0;

  function handleProceed() {
    if (!activeCourt || selectedSlots.length === 0 || runs.length === 0) return;
    onProceedToCheckout({
      court: activeCourt,
      startsAt: runs[0].startsAt,
      hours: selectedSlots.length,
      totalPiastres,
      depositPiastres,
      dueAtVenuePiastres,
      runs,
      selectedSlots,
    });
  }

  if (!venue) return null;

  return {
    view: 'Content',
    props: {
      reviews,
      reviewsLoading,
      reviewsError,
      venue,
      activeCourt,
      onSelectCourt,
      onClose,
      upcomingDays,
      selectedDate,
      setSelectedDate,
      slots,
      loadingSlots,
      error,
      selectedSlots,
      toggleSlot,
      runs,
      totalPiastres,
      depositPiastres,
      dueAtVenuePiastres,
      handleProceed,
      eligible,
    },
  } as const;
}
