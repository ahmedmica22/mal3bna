import type { AvailabilitySlot } from '../../../types/domain';

interface SlotCardProps {
  slot: AvailabilitySlot;
  isSelected: boolean;
  isAvailable: boolean;
  locale: string;
  translate: (key: string, params?: Record<string, string | number>) => string;
  onSelect: (slot: AvailabilitySlot) => void;
}

export function SlotCard({
  slot,
  isSelected,
  isAvailable,
  locale,
  translate,
  onSelect,
}: SlotCardProps) {
  const startStr = new Date(slot.startsAt).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Africa/Cairo',
  });
  const endStr = new Date(slot.endsAt).toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Africa/Cairo',
  });

  return (
    <button
      key={slot.startsAt}
      type="button"
      disabled={!isAvailable}
      aria-pressed={isSelected}
      className={`slot p-3 rounded-2xl flex flex-col items-center justify-between gap-2 transition-all text-center border relative overflow-hidden ${
        isSelected
          ? 'selected bg-emerald-600 text-white border-emerald-600 font-extrabold shadow-xl shadow-emerald-600/25 scale-[1.03] z-10 dark:bg-lime-400 dark:text-slate-950 dark:border-lime-400 dark:shadow-lime-400/30'
          : isAvailable
            ? 'bg-emerald-50/70 hover:bg-emerald-100/90 border-emerald-200 text-slate-900 cursor-pointer hover:border-emerald-500 hover:scale-[1.02] dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-100 dark:hover:border-lime-400/40'
            : 'bg-slate-100 border-slate-200/60 text-slate-500 cursor-not-allowed opacity-60 dark:bg-black/30 dark:border-white/5 dark:text-slate-600 dark:opacity-45'
      }`}
      onClick={() => onSelect(slot)}
    >
      {isSelected && (
        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white text-emerald-700 dark:bg-slate-950 dark:text-lime-400 flex items-center justify-center text-[10px] font-black">
          ✓
        </div>
      )}
      <div>
        <span
          className={`text-[10px] uppercase font-bold block mb-0.5 ${isSelected ? 'text-white/80 dark:text-slate-800' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {translate('Kickoff')}
        </span>
        <strong
          className={`text-sm font-black tracking-tight block ${isSelected ? 'text-white dark:text-slate-950' : 'text-slate-900 dark:text-slate-100'}`}
        >
          {startStr} – {endStr}
        </strong>
      </div>

      <div
        className={`px-2 py-0.5 rounded-lg text-[11px] font-black w-full text-center ${
          isSelected
            ? 'bg-slate-100 text-white dark:bg-slate-950/20 dark:text-slate-950'
            : isAvailable
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 dark:bg-lime-400/10 dark:text-lime-400 dark:border-lime-400/20'
              : 'bg-slate-200/60 text-slate-500 dark:bg-white/5 dark:text-slate-500'
        }`}
      >
        {isAvailable
          ? translate('{{value0}} EGP', {
              value0: ((slot.pricePiastres ?? 0) / 100).toFixed(0),
            })
          : slot.status === 'past'
            ? translate('Past')
            : translate('Booked')}
      </div>
    </button>
  );
}
