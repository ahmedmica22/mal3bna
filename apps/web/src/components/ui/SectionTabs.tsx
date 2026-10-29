import { useId, useRef, type KeyboardEvent } from 'react';
import { useLanguage } from '../../store/LanguageStore';
import type { SectionTab } from '../../types/ui';

export type { SectionTab };

export function SectionTabs<T extends string>({
  items,
  value,
  onChange,
  label,
  vertical = false,
}: {
  items: readonly SectionTab<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  vertical?: boolean;
}) {
  const { translate, language } = useLanguage();
  const id = useId();
  const container = useRef<HTMLDivElement>(null);
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    const forward = vertical ? 'ArrowDown' : language === 'ar' ? 'ArrowLeft' : 'ArrowRight';
    const backward = vertical ? 'ArrowUp' : language === 'ar' ? 'ArrowRight' : 'ArrowLeft';
    if (event.key === forward) next = (index + 1) % items.length;
    else if (event.key === backward) next = (index + items.length - 1) % items.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = items.length - 1;
    else return;
    event.preventDefault();
    const item = items[next];
    if (item) {
      onChange(item.id);
      container.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
    }
  }
  return (
    <div
      ref={container}
      role="tablist"
      aria-label={translate(label)}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      className={`flex gap-2 overflow-x-auto pb-2 ${vertical ? 'lg:flex-col' : ''}`}
    >
      {items.map(({ id: key, label: title, icon: Icon, badge }, index) => (
        <button
          key={key}
          id={`${id}-${key}`}
          type="button"
          role="tab"
          aria-selected={value === key}
          tabIndex={value === key ? 0 : -1}
          onClick={() => onChange(key)}
          onKeyDown={(event) => navigate(event, index)}
          className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-start text-xs font-bold transition-colors ${value === key ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-lime-400/30 dark:bg-lime-400/10 dark:text-lime-300' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-[#13221f] dark:text-slate-300'}`}
        >
          {Icon && <Icon size={17} aria-hidden="true" />}
          <span>{translate(title)}</span>
          {badge !== undefined && badge > 0 && (
            <span className="ms-auto rounded-full bg-rose-500 px-2 py-0.5 text-[10px] text-white">
              {badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
