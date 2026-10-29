import { useLanguage } from '../../../../store/LanguageStore';
import type { HomeContentProps } from '../types';

export function HomeActiveFilterChips({
  areaId,
  areas,
  clearFilters,
  hasActiveFilters,
  pitchSize,
  searchTerm,
  setAreaId,
  setPitchSize,
  setSearchTerm,
  setSport,
  sport,
  translate,
}: Pick<
  HomeContentProps,
  | 'areaId'
  | 'areas'
  | 'clearFilters'
  | 'hasActiveFilters'
  | 'pitchSize'
  | 'searchTerm'
  | 'setAreaId'
  | 'setPitchSize'
  | 'setSearchTerm'
  | 'setSport'
  | 'sport'
  | 'translate'
>) {
  const { language } = useLanguage();
  return (
    <>
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap my-4 px-1 animate-in fade-in duration-200">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {translate('Active filters:')}
          </span>
          {areaId && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-lime-300 border border-emerald-500/25">
              <span>
                📍 {areas.find((a) => a.id === areaId)?.[language === 'ar' ? 'nameAr' : 'nameEn'] ?? translate('Area')}
              </span>
              <button
                type="button"
                aria-label={translate('Remove area filter')}
                onClick={() => setAreaId('')}
                className="cursor-pointer hover:opacity-75 font-black text-sm leading-none"
              >
                ×
              </button>
            </span>
          )}
          {searchTerm && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-lime-300 border border-emerald-500/25">
              <span>
                {translate('Search: "')}
                {searchTerm}"
              </span>
              <button
                type="button"
                aria-label={translate('Remove search filter')}
                onClick={() => setSearchTerm('')}
                className="cursor-pointer hover:opacity-75 font-black text-sm leading-none"
              >
                ×
              </button>
            </span>
          )}
          {sport && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-lime-300 border border-emerald-500/25">
              <span>{sport === 'padel' ? translate('🎾 Padel') : translate('⚽ Football')}</span>
              <button
                type="button"
                aria-label={translate('Remove sport filter')}
                onClick={() => setSport('')}
                className="cursor-pointer hover:opacity-75 font-black text-sm leading-none"
              >
                ×
              </button>
            </span>
          )}
          {pitchSize && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-lime-300 border border-emerald-500/25">
              <span>
                {pitchSize}
                {translate('-a-side')}
              </span>
              <button
                type="button"
                aria-label={translate('Remove pitch size filter')}
                onClick={() => setPitchSize('')}
                className="cursor-pointer hover:opacity-75 font-black text-sm leading-none"
              >
                ×
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-bold text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 underline cursor-pointer ms-2 transition-colors"
          >
            {translate('Reset all')}
          </button>
        </div>
      )}
    </>
  );
}
