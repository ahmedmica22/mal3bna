import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useLanguage } from '../../store/LanguageStore';
import type { SelectOption, SelectProps } from '../../types/ui';

export type { SelectOption, SelectProps };

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select option…',
  className = '',
  disabled = false,
}: SelectProps) {
  const { translate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

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

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${isOpen ? 'z-50' : 'z-10'} ${className}`}
    >
      {/* Trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border text-start ${
          isOpen
            ? 'border-emerald-600 ring-2 ring-emerald-600/20 dark:border-lime-400 dark:ring-lime-400/20'
            : 'border-slate-300 hover:border-slate-400 dark:border-white/15 dark:hover:border-white/30'
        } bg-white text-slate-900 dark:bg-[#0b1715] dark:text-slate-100 shadow-sm`}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption?.icon && <span className="shrink-0">{selectedOption.icon}</span>}
          <span>{translate(selectedOption ? selectedOption.label : placeholder)}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-600 dark:text-lime-400' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 start-0 end-0 min-w-full mt-1.5 p-1.5 rounded-2xl border shadow-2xl backdrop-blur-xl max-h-60 overflow-y-auto space-y-1 bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50 dark:bg-[#13221f]/95 dark:border-white/15 dark:text-slate-100 dark:shadow-black/70 animate-in fade-in zoom-in-95 duration-150"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-between gap-2 transition-all ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-600/20 dark:bg-lime-400/15 dark:text-lime-300 dark:border-lime-400/30'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{translate(opt.label)}</span>
                </div>
                {isSelected && (
                  <Check size={14} className="shrink-0 text-emerald-600 dark:text-lime-400" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
