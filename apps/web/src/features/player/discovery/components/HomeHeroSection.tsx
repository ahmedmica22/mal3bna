import React, { useState } from 'react';
import { ArrowDown, Sparkles, ShieldCheck, Zap, Trophy, Flame } from 'lucide-react';

interface HomeHeroSectionProps {
  translate: (key: string, params?: Record<string, string | number>) => string;
  onSelectSport: (sport: string) => void;
  selectedSport: string;
}

export function HomeHeroSection({
  translate,
  onSelectSport,
  selectedSport,
}: HomeHeroSectionProps) {
  const [activePreviewSport, setActivePreviewSport] = useState<'football' | 'padel'>('football');

  const handleSportClick = (sport: 'football' | 'padel') => {
    setActivePreviewSport(sport);
    onSelectSport(selectedSport === sport ? '' : sport);
  };

  return (
    <section className="hero relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-teal-900/10 to-slate-900/40 p-6 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:from-[#0b1715] dark:via-[#0e241f] dark:to-[#081311] my-6 transition-all duration-300">
      {/* Ambient Radial Floodlight Glows */}
      <div className="absolute -top-24 -end-24 w-96 h-96 bg-lime-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute -bottom-24 -start-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Headline & Action */}
        <div className="lg:col-span-7 space-y-6 text-start">
          {/* Live Status Beacon */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 dark:bg-lime-400/10 dark:border-lime-400/30 text-emerald-700 dark:text-lime-300 text-xs font-black tracking-wide shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-lime-400 animate-radar" />
            <span>{translate('⚽ CAIRO · EGP · AFRICA/CAIRO')}</span>
            <span className="opacity-40">|</span>
            <span className="hidden sm:inline font-semibold opacity-90">
              {translate('Instant 10-Min Hold Guarantee')}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            {translate('Find the court that feels like')}{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-500 to-lime-400 dark:from-lime-400 dark:via-emerald-300 dark:to-teal-200">
              {translate('home.')}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl">
            {translate(
              'Football and padel venues across Cairo, real-time availability, and instant 10-minute hold booking with 30% online deposit or full checkout.',
            )}
          </p>

          {/* Quick Sport Selector Pills */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleSportClick('football')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border transition-all duration-200 cursor-pointer ${
                activePreviewSport === 'football'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/25 dark:bg-lime-400 dark:text-slate-950 dark:border-lime-300 dark:shadow-lime-400/25 scale-105'
                  : 'bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-emerald-400/50 dark:hover:border-lime-400/40'
              }`}
            >
              <span>⚽</span>
              <span>{translate('Football (5, 7, 11-a-side)')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSportClick('padel')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black border transition-all duration-200 cursor-pointer ${
                activePreviewSport === 'padel'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/25 dark:bg-lime-400 dark:text-slate-950 dark:border-lime-300 dark:shadow-lime-400/25 scale-105'
                  : 'bg-white/80 dark:bg-white/5 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-white/10 hover:border-emerald-400/50 dark:hover:border-lime-400/40'
              }`}
            >
              <span>🎾</span>
              <span>{translate('Padel Courts')}</span>
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <a
              href="#venues"
              className="button group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 dark:bg-lime-400 dark:hover:bg-lime-300 dark:text-slate-950 dark:shadow-lime-400/30 transition-all duration-200 active:scale-95 cursor-pointer no-underline"
            >
              <span>{translate('Explore venues')}</span>
              <ArrowDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
            </a>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <ShieldCheck size={16} className="text-emerald-600 dark:text-lime-400 shrink-0" />
              <span>{translate('100% Verified Cairo Venues')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Animated Pitch Visualizer */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto w-full max-w-md rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-[#0a231c]/95 to-[#05130f]/95 p-6 shadow-2xl backdrop-blur-xl dark:border-white/15 overflow-hidden">
            {/* Tactical Pitch Grid Background */}
            <div className="pitch-grid-bg absolute inset-0 opacity-40 pointer-events-none" />

            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#bef264] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-lime-400">
                  {activePreviewSport === 'football' ? 'FOOTBALL ARENA' : 'PANORAMIC PADEL'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-300/80 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                {activePreviewSport === 'football' ? 'Artificial Turf' : 'Panoramic Glass'}
              </span>
            </div>

            {/* Stadium Pitch Canvas */}
            <div className="relative h-56 sm:h-64 w-full rounded-2xl border-2 border-lime-400/40 bg-gradient-to-br from-[#0c2e24] via-[#082019] to-[#04120e] p-3 flex items-center justify-center overflow-hidden shadow-inner">
              {/* Pitch Markings SVG */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 180" fill="none">
                {/* Border line */}
                <rect
                  x="10"
                  y="10"
                  width="280"
                  height="160"
                  rx="6"
                  stroke="#a3e635"
                  strokeWidth="2"
                  strokeOpacity="0.75"
                />

                {/* Halfway line */}
                <line
                  x1="150"
                  y1="10"
                  x2="150"
                  y2="170"
                  stroke="#a3e635"
                  strokeWidth="2"
                  strokeOpacity="0.75"
                />

                {/* Center circle */}
                <circle
                  cx="150"
                  cy="90"
                  r="34"
                  stroke="#a3e635"
                  strokeWidth="2"
                  strokeOpacity="0.8"
                />

                {activePreviewSport === 'football' ? (
                  <>
                    {/* Goal Boxes (Football) */}
                    <rect
                      x="10"
                      y="50"
                      width="35"
                      height="80"
                      stroke="#4ade80"
                      strokeWidth="1.8"
                      strokeOpacity="0.7"
                    />
                    <rect
                      x="255"
                      y="50"
                      width="35"
                      height="80"
                      stroke="#4ade80"
                      strokeWidth="1.8"
                      strokeOpacity="0.7"
                    />
                    {/* Penalty Spots */}
                    <circle cx="35" cy="90" r="2.5" fill="#a3e635" />
                    <circle cx="265" cy="90" r="2.5" fill="#a3e635" />
                  </>
                ) : (
                  <>
                    {/* Padel Service Lines */}
                    <line
                      x1="65"
                      y1="10"
                      x2="65"
                      y2="170"
                      stroke="#4ade80"
                      strokeWidth="1.8"
                      strokeOpacity="0.7"
                    />
                    <line
                      x1="235"
                      y1="10"
                      x2="235"
                      y2="170"
                      stroke="#4ade80"
                      strokeWidth="1.8"
                      strokeOpacity="0.7"
                    />
                    <line
                      x1="65"
                      y1="90"
                      x2="235"
                      y2="90"
                      stroke="#4ade80"
                      strokeWidth="1.8"
                      strokeOpacity="0.6"
                    />
                  </>
                )}

                {/* Center Ball */}
                <circle cx="150" cy="90" r="8" fill="#bef264" />
                <circle cx="148" cy="88" r="2.5" fill="#ffffff" />
              </svg>

              {/* Pulsing Aura around center ball */}
              <div className="w-16 h-16 rounded-full bg-lime-400/20 blur-md animate-pulse" />

              {/* Floating Matchday Tag */}
              <div className="absolute bottom-3 end-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[11px] font-bold text-white shadow-lg">
                <Flame size={12} className="text-amber-400 animate-bounce" />
                <span>Cairo Night Match</span>
              </div>
            </div>

            {/* Quick Pitch Features */}
            <div className="grid grid-cols-2 gap-2 mt-4 relative z-10 text-xs font-bold text-slate-200">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <Zap size={14} className="text-lime-400 shrink-0" />
                <span>30% Deposit Hold</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10">
                <Trophy size={14} className="text-emerald-400 shrink-0" />
                <span>Official Pitch Specs</span>
              </div>
            </div>
          </div>

          {/* Floating Floating Stat Badges */}
          <div className="hidden sm:flex absolute -bottom-5 -start-5 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white border border-lime-400/40 shadow-xl backdrop-blur-xl animate-float">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 animate-ping" />
            <div className="text-start">
              <p className="text-[10px] text-slate-400 font-bold m-0 uppercase leading-none">Instant Hold</p>
              <p className="text-xs font-black text-lime-400 m-0 leading-tight">10-Min Timer</p>
            </div>
          </div>

          <div className="hidden sm:flex absolute -top-4 -end-4 items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 text-white border border-emerald-500/40 shadow-xl backdrop-blur-xl animate-float-delayed">
            <Sparkles size={14} className="text-emerald-400" />
            <div className="text-start">
              <p className="text-[10px] text-slate-400 font-bold m-0 uppercase leading-none">Cairo Venues</p>
              <p className="text-xs font-black text-emerald-300 m-0 leading-tight">Live Real-time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
