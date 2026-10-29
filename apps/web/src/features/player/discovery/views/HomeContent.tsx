import type { HomeContentProps } from '../types';
import { HomeDiscoverySection } from '../components/HomeDiscoverySection';
import { HomeHeroSection } from '../components/HomeHeroSection';
import { MapPin, Clock, Sparkles } from 'lucide-react';

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
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
      {/* Animated Hero Showcase */}
      <HomeHeroSection
        translate={translate}
        onSelectSport={setSport}
        selectedSport={sport}
      />

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

      {/* 3 Steps Promise — Responsive Glass Cards with Active Animations */}
      <section className="promise grid grid-cols-1 md:grid-cols-3 gap-6 my-16">
        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl dark:border-white/10 dark:bg-[#13221f]/75 dark:hover:border-lime-400/40">
          <div className="flex items-center gap-4 mb-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 font-black text-lg dark:bg-lime-400/15 dark:text-lime-400 shadow-sm group-hover:scale-110 transition-transform">
              01
            </span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-emerald-600 dark:text-lime-400">
              <MapPin size={20} />
            </div>
          </div>
          <strong className="block text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            {translate('Pick your court')}
          </strong>
          <p className="text-xs text-slate-500 dark:text-slate-400 m-0 leading-relaxed">
            {translate('Browse approved venues across New Cairo, Maadi, Zayed, and 6th of October.')}
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl dark:border-white/10 dark:bg-[#13221f]/75 dark:hover:border-lime-400/40">
          <div className="flex items-center gap-4 mb-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 font-black text-lg dark:bg-lime-400/15 dark:text-lime-400 shadow-sm group-hover:scale-110 transition-transform">
              02
            </span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-emerald-600 dark:text-lime-400">
              <Clock size={20} />
            </div>
          </div>
          <strong className="block text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            {translate('Choose consecutive hours')}
          </strong>
          <p className="text-xs text-slate-500 dark:text-slate-400 m-0 leading-relaxed">
            {translate('Lock 1 to 4 consecutive hours with guaranteed instant 10-minute payment hold.')}
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl dark:border-white/10 dark:bg-[#13221f]/75 dark:hover:border-lime-400/40">
          <div className="flex items-center gap-4 mb-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 font-black text-lg dark:bg-lime-400/15 dark:text-lime-400 shadow-sm group-hover:scale-110 transition-transform">
              03
            </span>
            <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-emerald-600 dark:text-lime-400">
              <Sparkles size={20} />
            </div>
          </div>
          <strong className="block text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            {translate('Show up and kickoff')}
          </strong>
          <p className="text-xs text-slate-500 dark:text-slate-400 m-0 leading-relaxed">
            {translate('Check in seamlessly via matchday QR code or code verification upon arrival.')}
          </p>
        </div>
      </section>
    </div>
  );
}
