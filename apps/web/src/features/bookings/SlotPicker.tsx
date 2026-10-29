import { SectionTabs } from '../../components/ui/SectionTabs';
import { useLanguage } from '../../store/LanguageStore';
import { useEffect, useMemo, useState } from 'react';
import type { AvailabilitySlot } from '../../types/domain';
import { Badge } from '../../components/ui/Badge';
import { Clock, AlertCircle } from 'lucide-react';
import { SlotCard } from './components/SlotCard';
import { SlotDurationSelector } from './components/SlotDurationSelector';
import { SlotCheckoutDock } from './components/SlotCheckoutDock';

export function SlotPicker({
  slots,
  onSelect,
  maxHours = 4,
  onProceed,
}: {
  slots: AvailabilitySlot[];
  onSelect: (slots: AvailabilitySlot[]) => void;
  maxHours?: number;
  onProceed?: () => void;
}) {
  const { translate, locale } = useLanguage();
  const [selected, setSelected] = useState<AvailabilitySlot[]>([]);
  const [preferredDuration, setPreferredDuration] = useState<number>(1);
  const [filterPeriod, setFilterPeriod] = useState<
    'all' | 'morning' | 'afternoon' | 'evening' | 'night'
  >('all');
  const effectiveMaxHours = Math.min(maxHours ?? 4, 4); // Platform rule: max 4 slots
  const isSlotAvailable = (slot: AvailabilitySlot) =>
    slot.status ? slot.status === 'available' : slot.available === true;

  const selectConsecutiveSlots = (startSlot: AvailabilitySlot, count: number) => {
    if (!isSlotAvailable(startSlot)) return;
    const sortedSlots = [...slots].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    const startIndex = sortedSlots.findIndex((s) => s.startsAt === startSlot.startsAt);
    if (startIndex === -1) return;

    const result: AvailabilitySlot[] = [startSlot];
    for (let i = 1; i < count; i++) {
      const prev = result[i - 1];
      const next = sortedSlots[startIndex + i];
      if (next && isSlotAvailable(next) && next.startsAt === prev?.endsAt) {
        result.push(next);
      } else {
        break;
      }
    }
    setSelected(result);
    onSelect(result);
  };

  const handleDurationChange = (hours: number) => {
    const capped = Math.min(Math.max(1, hours), effectiveMaxHours);
    setPreferredDuration(capped);
    if (selected.length > 0 && selected[0]) {
      selectConsecutiveSlots(selected[0], capped);
    }
  };

  useEffect(() => {
    if (!selected.length) return;

    const latestByStart = new Map(slots.map((slot) => [slot.startsAt, slot]));
    const refreshedSelection = selected.map((slot) => latestByStart.get(slot.startsAt));
    if (refreshedSelection.some((slot) => !slot || !isSlotAvailable(slot))) {
      setSelected([]);
      onSelect([]);
    }
  }, [slots, selected, onSelect]);

  const choose = (slot: AvailabilitySlot) => {
    if (!isSlotAvailable(slot)) return;

    if (preferredDuration > 1) {
      const isAlreadyFirst = selected.length > 0 && selected[0]?.startsAt === slot.startsAt;
      if (isAlreadyFirst && selected.length === preferredDuration) {
        setSelected([]);
        onSelect([]);
        return;
      }
      selectConsecutiveSlots(slot, preferredDuration);
      return;
    }

    const next = selected.some((item) => item.startsAt === slot.startsAt)
      ? selected.filter((item) => item.startsAt !== slot.startsAt)
      : [...selected, slot];
    const sorted = next.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    if (sorted.length > effectiveMaxHours) return;
    if (sorted.some((item, index) => index > 0 && item.startsAt !== sorted[index - 1]?.endsAt)) {
      // A distant click begins a new range; never silently book the gap.
      setSelected([slot]);
      onSelect([slot]);
      return;
    }
    setSelected(sorted);
    onSelect(sorted);
  };

  const total = useMemo(
    () => selected.reduce((sum, slot) => sum + (slot.pricePiastres ?? 0), 0),
    [selected],
  );

  // Helper to extract hour in Cairo time
  const getCairoHour = (isoString: string) => {
    const date = new Date(isoString);
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Africa/Cairo',
      hour: 'numeric',
      hour12: false,
    }).formatToParts(date);
    return Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  };

  const filteredSlots = useMemo(() => {
    if (filterPeriod === 'all') return slots;
    return slots.filter((slot) => {
      const hour = getCairoHour(slot.startsAt);
      if (filterPeriod === 'morning') return hour >= 6 && hour < 12;
      if (filterPeriod === 'afternoon') return hour >= 12 && hour < 17;
      if (filterPeriod === 'evening') return hour >= 17 && hour < 23;
      if (filterPeriod === 'night') return hour >= 23 || hour < 6;
      return true;
    });
  }, [slots, filterPeriod]);

  const availableCount = slots.filter(isSlotAvailable).length;

  return (
    <div className="slot-picker rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-7 backdrop-blur-xl shadow-xl dark:border-white/10 dark:bg-[#13221f]/80 dark:shadow-2xl my-6">
      {/* Header */}
      <div className="slot-heading flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className="eyebrow text-xs font-black text-emerald-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            {translate('03 · SELECT MATCH HOURS')}
          </p>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 m-0">
              {translate('Available slots')}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-lime-400/10 dark:text-lime-300 dark:border-lime-400/25">
              {translate('24-Hour Schedule ·')} {availableCount} {translate('Available')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="success">
            <Clock size={12} className="inline me-1" /> {translate('Max 4 consecutive hours')}
          </Badge>
        </div>
      </div>

      {/* Duration Chooser */}
      <SlotDurationSelector
        selectedCount={selected.length}
        preferredDuration={preferredDuration}
        effectiveMaxHours={effectiveMaxHours}
        translate={translate}
        onDurationChange={handleDurationChange}
      />

      {/* Period Filter Tabs */}
      {slots.length >= 8 && (
        <SectionTabs
          value={filterPeriod}
          onChange={setFilterPeriod}
          label="Schedule time window"
          items={[
            { id: 'all', label: 'All (24h)' },
            { id: 'morning', label: '🌅 Morning (06:00 - 12:00)' },
            { id: 'afternoon', label: '☀️ Afternoon (12:00 - 17:00)' },
            { id: 'evening', label: '🌙 Prime Evening (17:00 - 23:00)' },
            { id: 'night', label: '🌌 Night (23:00 - 06:00)' },
          ]}
        />
      )}

      {/* Slots Grid */}
      {filteredSlots.length > 0 ? (
        <div className="slot-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredSlots.map((slot) => (
            <SlotCard
              key={slot.startsAt}
              slot={slot}
              isSelected={selected.some((item) => item.startsAt === slot.startsAt)}
              isAvailable={isSlotAvailable(slot)}
              locale={locale}
              translate={translate}
              onSelect={choose}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200 dark:bg-black/20 dark:border-white/10">
          <AlertCircle size={28} className="text-amber-800 mx-auto mb-2 dark:text-amber-400" />
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200">
            {translate('No match slots in this time window')}
          </h4>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            {translate('Try switching the filter to "All (24h)" or select another match date.')}
          </p>
        </div>
      )}

      {/* Selected Slots Checkout Dock */}
      {selected.length > 0 && (
        <SlotCheckoutDock
          selectedCount={selected.length}
          totalPiastres={total}
          translate={translate}
          onDurationChange={handleDurationChange}
          onProceed={onProceed}
        />
      )}
    </div>
  );
}
