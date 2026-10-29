import { useLanguage } from '../../store/LanguageStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES, WEEKDAYS, getMonthCalendarDays } from './calendar-utils';
import type { CalendarMonthViewProps } from '../../types/ui';

export type { CalendarMonthViewProps };

export function CalendarMonthView({
  viewYear,
  viewMonth,
  onPrevMonth,
  onNextMonth,
  selectedDateStr,
  minDateStr,
  maxDateStr,
  todayStr,
  onSelectDate,
}: CalendarMonthViewProps) {
  const { translate } = useLanguage();
  const { firstDayOfWeek, days } = getMonthCalendarDays(viewYear, viewMonth);

  return (
    <div>
      {/* Month & Year Navigation Header */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-black tracking-tight text-slate-900 dark:text-white">
          {translate(MONTH_NAMES[viewMonth] ?? '')} {viewYear}
        </h4>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevMonth}
            aria-label={translate('Previous Month')}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            aria-label={translate('Next Month')}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
        {WEEKDAYS.map((w) => (
          <span
            key={w}
            className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 py-1"
          >
            {translate(w)}
          </span>
        ))}
      </div>

      {/* Day Cells Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Leading blanks */}
        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
          <div key={`empty-${idx}`} className="w-8 h-8" />
        ))}

        {/* Days */}
        {days.map(({ day, dateStr }) => {
          const isSelected = selectedDateStr === dateStr;
          const isToday = dateStr === todayStr;
          const isPast = minDateStr ? dateStr < minDateStr : false;
          const isFuture = maxDateStr ? dateStr > maxDateStr : false;
          const isDisabled = isPast || isFuture;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelectDate(dateStr)}
              className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white dark:bg-lime-400 dark:text-slate-950 font-black shadow-md shadow-emerald-600/30 dark:shadow-lime-400/20 ring-2 ring-emerald-600/30 dark:ring-lime-400/30'
                  : isToday
                  ? 'border border-emerald-600/50 dark:border-lime-400/50 text-emerald-600 dark:text-lime-400 font-bold hover:bg-emerald-50 dark:hover:bg-lime-400/10'
                  : isDisabled
                  ? 'text-slate-300 dark:text-slate-700 opacity-40 cursor-not-allowed'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10'
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
