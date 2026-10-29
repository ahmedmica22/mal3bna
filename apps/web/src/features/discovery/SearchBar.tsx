import { useMemo } from 'react';
import { useLanguage } from '../../store/LanguageStore';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Select } from '../../components/ui/Select';

const sportOptions = [
  { value: '', label: 'All sports' },
  { value: 'football', label: '⚽ Football' },
  { value: 'padel', label: '🎾 Padel' },
];

const sizeOptions = [
  { value: '', label: 'Any size' },
  { value: '5', label: '5-a-side' },
  { value: '7', label: '7-a-side' },
  { value: '11', label: '11-a-side' },
];

export function SearchBar({
  query = '',
  onQuery,
  sport,
  onSport,
  size = '',
  onSize,
  area = '',
  onArea,
  areas = [],
  onSearch,
  isSearching = false,
}: {
  query?: string;
  onQuery?: (value: string) => void;
  sport: string;
  onSport: (value: string) => void;
  size?: string;
  onSize?: (value: string) => void;
  area?: string;
  onArea?: (value: string) => void;
  areas?: Array<{ id: string; nameEn: string; nameAr: string }>;
  onSearch: () => void;
  isSearching?: boolean;
}) {
  const { translate, language } = useLanguage();

  const areaOptions = useMemo(
    () => [
      { value: '', label: translate('All areas') },
      ...areas.map((a) => ({
        value: a.id,
        label: language === 'ar' ? a.nameAr : a.nameEn,
      })),
    ],
    [areas, language, translate],
  );

  return (
    <div className="search-bar relative z-30 flex flex-wrap items-center gap-3 p-2.5 rounded-3xl bg-white/95 border-slate-200 shadow-xl dark:bg-[#13221f]/90 backdrop-blur-md border dark:border-white/10 dark:shadow-black/40 transition-all focus-within:border-emerald-600/50 dark:focus-within:border-lime-400/50 focus-within:ring-2 focus-within:ring-emerald-600/20 dark:focus-within:ring-lime-400/20 max-w-5xl mx-auto my-6">
      <div className="search-field flex-1 flex items-center gap-2.5 px-3 min-w-[200px]">
        <Search size={18} className="text-emerald-600 dark:text-lime-400 shrink-0" />
        <input
          placeholder={translate('Search venues, clubs, or Cairo areas…')}
          aria-label={translate('Search venues or areas')}
          value={query}
          onChange={(event) => onQuery?.(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onSearch()}
          className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 dark:text-slate-100 dark:placeholder-slate-400 text-sm focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {onArea && (
          <Select
            value={area}
            onChange={onArea}
            options={areaOptions}
            className="min-w-[130px]"
          />
        )}

        <Select value={sport} onChange={onSport} options={sportOptions} className="min-w-[130px]" />

        {sport === 'football' && onSize && (
          <Select value={size} onChange={onSize} options={sizeOptions} className="min-w-[120px]" />
        )}

        <button
          type="button"
          disabled={isSearching}
          onClick={onSearch}
          className="button inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-slate-950 dark:shadow-lime-400/20 transition-all cursor-pointer disabled:opacity-75 active:scale-95"
        >
          {isSearching ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-slate-200 border-t-white rounded-full animate-spin dark:border-slate-950/30 dark:border-t-slate-950" />
              <span>{translate('Finding…')}</span>
            </>
          ) : (
            <>
              <SlidersHorizontal size={14} />
              <span>{translate('Find courts')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
