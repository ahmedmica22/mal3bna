import { Clock } from 'lucide-react';

interface SlotCheckoutDockProps {
  selectedCount: number;
  totalPiastres: number;
  translate: (key: string, params?: Record<string, string | number>) => string;
  onDurationChange: (hours: number) => void;
  onProceed?: (() => void) | undefined;
}

export function SlotCheckoutDock({
  selectedCount,
  totalPiastres,
  translate,
  onDurationChange,
  onProceed,
}: SlotCheckoutDockProps) {
  return (
    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-white/10 animate-in fade-in duration-200">
      <div className="bg-[#0c1715] border border-lime-400/40 rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-2xl ring-1 ring-lime-400/20 flex-wrap">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-lime-400/15 text-lime-400 border border-lime-400/30">
              <Clock size={11} className="inline me-0.5" />
              {selectedCount === 1
                ? translate('1 hour selected')
                : translate('{{value0}} consecutive hours', { value0: selectedCount })}
            </span>
            <span className="text-xs font-bold text-slate-400">{translate('Selected')}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-black text-[#baf35e] tracking-tight">
              {(totalPiastres / 100).toFixed(2)} {translate('EGP')}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2" role="radiogroup" aria-label={translate('Adjust hours')}>
            <span className="text-[11px] font-bold text-slate-400 me-1">{translate('Duration:')}</span>
            {[1, 2, 3, 4].map((hours) => (
              <div
                key={hours}
                role="radio"
                tabIndex={0}
                aria-checked={selectedCount === hours}
                onClick={() => onDurationChange(hours)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onDurationChange(hours);
                  }
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer border select-none ${
                  selectedCount === hours
                    ? 'bg-lime-400 text-slate-950 border-lime-400 shadow-sm shadow-lime-400/30'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 border-white/10'
                }`}
              >
                {hours}h
              </div>
            ))}
          </div>
        </div>

        {onProceed && (
          <button
            type="button"
            onClick={onProceed}
            className="px-6 sm:px-8 py-3.5 rounded-full bg-[#baf35e] hover:bg-[#a8e646] text-[#09110f] font-black text-sm tracking-wide shadow-[0_0_20px_rgba(186,243,94,0.4)] transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>{translate('Proceed to Checkout')}</span>
            <span className="text-base font-black">→</span>
          </button>
        )}
      </div>
    </div>
  );
}
