import { useLanguage } from '../../store/LanguageStore';
import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import {
  parseDateTimeString,
  formatDateString,
  KICKOFF_HOURS,
} from './calendar-utils';
import { CalendarMonthView } from './CalendarMonthView';
import type { DateTimePickerProps } from '../../types/ui';

export type { DateTimePickerProps };

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Select date & kickoff time…',
  className = '',
  disabled = false,
  align = 'left',
}: DateTimePickerProps) {
  const { translate, locale } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsed = parseDateTimeString(value);
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const todayStr = formatDateString(todayYear, todayMonth, todayDay);

  const selectedDateStr = parsed
    ? formatDateString(parsed.year, parsed.month, parsed.day)
    : todayStr;
  const selectedTimeStr = parsed
    ? `${String(parsed.hour).padStart(2, '0')}:${String(parsed.minute).padStart(2, '0')}`
    : '18:00';

  const [viewYear, setViewYear] = useState(parsed ? parsed.year : todayYear);
  const [viewMonth, setViewMonth] = useState(parsed ? parsed.month : todayMonth);

  useEffect(() => {
    if (parsed) {
      setViewYear(parsed.year);
      setViewMonth(parsed.month);
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleSelectDate(dateStr: string) {
    onChange(`${dateStr}T${selectedTimeStr}`);
  }

  function handleSelectTime(timeStr: string) {
    onChange(`${selectedDateStr}T${timeStr}`);
  }

  let displayLabel = placeholder;
  if (parsed) {
    const isToday = selectedDateStr === todayStr;
    const dateFormatted = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-EG' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(new Date(parsed.year, parsed.month, parsed.day));

    const datePrefix = isToday ? translate('Today') : dateFormatted;
    displayLabel = `${datePrefix}, ${selectedTimeStr}`;
  }

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${isOpen ? 'z-50' : 'z-10'} ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border text-start ${
          isOpen
            ? 'border-emerald-600 ring-2 ring-emerald-600/20 dark:border-lime-400 dark:ring-lime-400/20'
            : 'border-slate-300 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/30'
        } bg-white text-slate-900 dark:bg-[#0b1715] dark:text-slate-100 shadow-sm`}
      >
        <span className="flex items-center gap-2.5 truncate">
          <CalendarIcon
            size={16}
            className={`shrink-0 ${
              isOpen ? 'text-emerald-600 dark:text-lime-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          />
          <span className="truncate">{translate(displayLabel)}</span>
        </span>
        <Clock size={14} className="shrink-0 text-slate-500 dark:text-slate-400" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={translate('Datetime calendar picker')}
          className={`absolute z-[999] mt-2 p-4 w-[340px] sm:w-[420px] rounded-2xl border shadow-2xl backdrop-blur-xl bg-white/98 border-slate-200 text-slate-900 shadow-slate-400/30 dark:bg-[#0c1614] dark:border-white/20 dark:text-slate-100 dark:shadow-black/90 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'end-0 left-auto' : 'start-0 right-auto'
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Left: Calendar */}
            <div className="flex-1">
              <CalendarMonthView
                viewYear={viewYear}
                viewMonth={viewMonth}
                onPrevMonth={prevMonth}
                onNextMonth={nextMonth}
                selectedDateStr={selectedDateStr}
                todayStr={todayStr}
                onSelectDate={handleSelectDate}
              />
            </div>

            {/* Right: Kickoff Slot Hours */}
            <div className="sm:w-36 pt-2 sm:pt-0 sm:border-l border-slate-200 dark:border-white/10 sm:pl-3 flex flex-col">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock size={13} className="text-emerald-600 dark:text-lime-400" />
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {translate('Kickoff Slot')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
                {KICKOFF_HOURS.map((t) => {
                  const isSelected = selectedTimeStr === t;
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => handleSelectTime(t)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold text-center transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white dark:bg-lime-400 dark:text-slate-950 font-black shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-500">
            <span>{translate('Africa/Cairo timezone')}</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
            >
              {translate('Done')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
