import { useLanguage } from '../../store/LanguageStore';
import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  parseDateString,
  formatDateString,
} from './calendar-utils';
import { CalendarMonthView } from './CalendarMonthView';
import type { DatePickerProps } from '../../types/ui';

export type { DatePickerProps };

export function DatePicker({
  value,
  onChange,
  min,
  max,
  placeholder = 'Select date…',
  className = '',
  disabled = false,
  align = 'left',
}: DatePickerProps) {
  const { translate, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedValue = parseDateString(value);
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth();
  const todayDay = today.getDate();
  const todayStr = formatDateString(todayYear, todayMonth, todayDay);

  const [viewYear, setViewYear] = useState(parsedValue ? parsedValue.year : todayYear);
  const [viewMonth, setViewMonth] = useState(parsedValue ? parsedValue.month : todayMonth);

  useEffect(() => {
    if (parsedValue) {
      setViewYear(parsedValue.year);
      setViewMonth(parsedValue.month);
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

  function handleSelectDateStr(dateStr: string) {
    onChange(dateStr);
    setIsOpen(false);
  }

  let displayLabel = placeholder;
  if (parsedValue) {
    if (language === 'ar') {
      displayLabel = new Intl.DateTimeFormat('ar', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(parsedValue.year, parsedValue.month, parsedValue.day));
    } else {
      const isToday = value === todayStr;
      const dateFormatted = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(parsedValue.year, parsedValue.month, parsedValue.day));

      displayLabel = isToday
        ? translate('Today ({{date}})', { date: dateFormatted })
        : dateFormatted;
    }
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
          <span className="truncate">{displayLabel}</span>
        </span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={translate('Calendar date picker')}
          className={`absolute z-[999] mt-2 p-4 w-76 sm:w-80 rounded-2xl border shadow-2xl backdrop-blur-xl bg-white/98 border-slate-200 text-slate-900 shadow-slate-400/30 dark:bg-[#0c1614] dark:border-white/20 dark:text-slate-100 dark:shadow-black/90 animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'end-0 left-auto' : 'start-0 right-auto'
          }`}
        >
          <CalendarMonthView
            viewYear={viewYear}
            viewMonth={viewMonth}
            onPrevMonth={prevMonth}
            onNextMonth={nextMonth}
            selectedDateStr={value}
            minDateStr={min}
            maxDateStr={max}
            todayStr={todayStr}
            onSelectDate={handleSelectDateStr}
          />

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => handleSelectDateStr(todayStr)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
                value === todayStr
                  ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-lime-400 dark:text-slate-950 dark:border-lime-400 shadow-sm font-black'
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:text-slate-300'
              }`}
            >
              {translate('Today')}
            </button>
            <button
              type="button"
              onClick={() => {
                const tmrw = new Date();
                tmrw.setDate(tmrw.getDate() + 1);
                handleSelectDateStr(formatDateString(tmrw.getFullYear(), tmrw.getMonth(), tmrw.getDate()));
              }}
              className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:text-slate-300 transition-all"
            >
              {translate('Tomorrow')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
