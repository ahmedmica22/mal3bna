import { Clock } from 'lucide-react';

interface SlotDurationSelectorProps {
  selectedCount: number;
  preferredDuration: number;
  effectiveMaxHours: number;
  translate: (key: string, params?: Record<string, string | number>) => string;
  onDurationChange: (hours: number) => void;
}

export function SlotDurationSelector({
  selectedCount,
  preferredDuration,
  translate,
  onDurationChange,
}: SlotDurationSelectorProps) {
  return (
    <div
      role="radiogroup"
      aria-label={translate('Match duration')}
      className="duration-selector flex items-center justify-between gap-3 mb-5 p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex-wrap"
    >
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-emerald-700 dark:text-lime-400" />
        <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100">
          {translate('Match Duration:')}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ({translate('Choose 1 to 4 slots')})
        </span>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {[1, 2, 3, 4].map((hours) => {
          const isMatch =
            selectedCount === hours || (selectedCount === 0 && preferredDuration === hours);
          return (
            <div
              key={hours}
              role="radio"
              tabIndex={0}
              aria-checked={isMatch}
              onClick={() => onDurationChange(hours)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onDurationChange(hours);
                }
              }}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border select-none ${
                isMatch
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30 dark:bg-lime-400 dark:text-slate-950 dark:border-lime-400 dark:shadow-lime-400/25'
                  : 'bg-white dark:bg-black/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 border-slate-200 dark:border-white/10'
              }`}
            >
              {hours === 1
                ? translate('1 Slot (1h)')
                : translate('{{value0}} Slots ({{value0}}h)', { value0: hours })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
