import type { HomeContentProps } from '../types';
import { HomeDiscoverySection } from '../components/HomeDiscoverySection';

export function HomeContent({
  areaId,
  areas,
  clearFilters,
  filteredVenues,
  handleSearch,
  hasActiveFilters,
  isSearching,
  pitchSize,
  query,
  searchTerm,
  setAreaId,
  setPitchSize,
  setSearchTerm,
  setSport,
  sport,
  translate,
}: HomeContentProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
      {/* Hero Section */}
      <section className="hero grid md:grid-cols-2 gap-10 items-center my-8 p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200/80 shadow-xl shadow-emerald-500/5 dark:from-[#13221f]/90 dark:via-[#0e1a17]/95 dark:to-[#0b1715] dark:border-white/10 dark:shadow-2xl relative overflow-hidden transition-all">
        <div className="z-10">
          <p className="eyebrow text-xs font-black text-emerald-700 dark:text-lime-400 tracking-wider uppercase mb-2">
            {translate('⚽ CAIRO · EGP · AFRICA/CAIRO')}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight mb-4">
            {translate('Find the court that feels like')}{' '}
            <span className="text-emerald-600 dark:text-lime-400 italic">{translate('home.')}</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
            {translate(
              'Football and padel venues across Cairo, real-time availability, and instant 10-minute hold booking with 30% online deposit or full checkout.',
            )}
          </p>
          <a
            href="#venues"
            className="button inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-slate-950 dark:shadow-lime-400/25 transition-all"
          >
            <span>{translate('Explore venues')}</span>
            <span>↓</span>
          </a>
        </div>

        {/* Hero Visual Card */}
        <div className="hero-art relative flex items-center justify-center p-8 rounded-2xl bg-white/90 border border-emerald-200/70 shadow-md dark:bg-black/40 dark:border-white/10 overflow-hidden h-64 md:h-72">
          <div className="absolute -top-10 -end-10 w-44 h-44 bg-emerald-500/10 dark:bg-lime-400/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -start-10 w-44 h-44 bg-teal-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="text-center z-10">
            <span className="block text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-slate-100 leading-none">
              {translate('GOOD')}
              <br />
              <span className="text-emerald-600 dark:text-lime-400">{translate('GAME')}</span>
            </span>
            <i className="not-italic text-4xl mt-3 block animate-bounce">⚽</i>
          </div>
        </div>
      </section>

      {/* Discovery Section */}
      <HomeDiscoverySection
        {...{
          areaId,
          areas,
          clearFilters,
          filteredVenues,
          handleSearch,
          hasActiveFilters,
          isSearching,
          pitchSize,
          query,
          searchTerm,
          setAreaId,
          setPitchSize,
          setSearchTerm,
          setSport,
          sport,
          translate,
        }}
      />

      {/* 3 Steps Promise */}
      <section className="promise grid grid-cols-1 sm:grid-cols-3 gap-4 my-16 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center dark:bg-white/5 dark:border-white/10">
        <strong className="text-sm font-bold text-slate-700 dark:text-slate-200">
          <span className="text-emerald-700 me-2 font-black dark:text-lime-400">01</span>{' '}
          {translate('Pick your court')}
        </strong>
        <strong className="text-sm font-bold text-slate-700 dark:text-slate-200">
          <span className="text-emerald-700 me-2 font-black dark:text-lime-400">02</span>{' '}
          {translate('Choose consecutive hours')}
        </strong>
        <strong className="text-sm font-bold text-slate-700 dark:text-slate-200">
          <span className="text-emerald-700 me-2 font-black dark:text-lime-400">03</span>{' '}
          {translate('Show up and kickoff')}
        </strong>
      </section>
    </div>
  );
}
