import { consecutiveSlotCount } from '../utils/slots';
import { useEffect, useState } from 'react';
import { venueService } from '../services/venue.service';
import { venueDate, getUpcomingDays } from '../utils/venue-time';
import type { Venue, AvailabilitySlot } from '../types/domain';
export type WalkInInput = {
  courtId: string;
  startsAt: string;
  hours: number;
  customerName: string;
  customerPhone?: string;
  totalPiastres: number;
};
export function useWalkInForm(
  venue: Venue | null | undefined,
  visible: boolean,
  onConfirm: (input: WalkInInput) => Promise<boolean>,
  block = false,
) {
  const [courtId, setCourtId] = useState('');
  const [date, setDate] = useState(() => venueDate());
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [startsAt, setStartsAt] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hours, setHours] = useState(1);
  const [price, setPrice] = useState(block ? '0' : '');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const selectedCourt = courtId || venue?.courts?.[0]?.id || '';
  useEffect(() => {
    if (!visible || !selectedCourt) return;
    let active = true;
    setLoading(true);
    setSlots([]);
    setStartsAt('');
    venueService
      .getAvailability(selectedCourt, date)
      .then((rows) => {
        if (active) {
          setSlots(rows.filter((row) => row.status === 'available' && row.available !== false));
          setError(false);
        }
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [selectedCourt, date, visible]);
  const validPrice = /^\d+(\.\d{1,2})?$/.test(price);
  const maxHours = consecutiveSlotCount(slots, startsAt, venue?.maxHoursPerBooking ?? 4);
  const valid = name.trim().length > 0 && validPrice && !!startsAt && hours <= maxHours && !saving;
  async function submit() {
    if (!valid) return;
    setSaving(true);
    const [whole, fraction = ''] = price.split('.');
    try {
      const saved = await onConfirm({
        courtId: selectedCourt,
        startsAt,
        hours,
        customerName: name.trim(),
        customerPhone: phone.trim() || undefined,
        totalPiastres: Number(whole) * 100 + Number(fraction.padEnd(2, '0')),
      });
      if (!saved) setError(true);
    } finally {
      setSaving(false);
    }
  }
  return {
    hours,
    setHours,
    maxHours,
    courtId: selectedCourt,
    setCourtId,
    date,
    setDate,
    slots,
    startsAt,
    setStartsAt,
    name,
    setName,
    phone,
    setPhone,
    price,
    setPrice,
    loading,
    saving,
    error,
    valid,
    submit,
    days: getUpcomingDays(30),
  };
}
