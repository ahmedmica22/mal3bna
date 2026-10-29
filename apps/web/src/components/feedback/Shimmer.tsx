import React from 'react';

export function Shimmer({
  className = '',
  style,
  children,
  role,
  'aria-label': ariaLabel,
}: {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  role?: string;
  'aria-label'?: string;
}) {
  return (
    <div
      role={role}
      aria-label={ariaLabel}
      style={style}
      className={`shimmer-wave rounded-xl border border-slate-200/60 dark:border-white/5 ${className}`}
    >
      {children}
    </div>
  );
}

export function ShimmerText({
  lines = 2,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  const widths = ['w-full', 'w-4/5', 'w-2/3', 'w-1/2', 'w-3/4'];
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Shimmer
          key={i}
          className={`h-4 ${widths[i % widths.length]} rounded-md`}
        />
      ))}
    </div>
  );
}

export function ShimmerVenueCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#13221f] flex flex-col gap-3.5 overflow-hidden ${className}`}
    >
      {/* Venue cover image skeleton */}
      <Shimmer className="h-44 w-full rounded-2xl relative overflow-hidden">
        <div className="absolute top-3 right-3 w-16 h-6 rounded-full bg-slate-300/40 dark:bg-white/10" />
      </Shimmer>

      {/* Title & location */}
      <div className="space-y-2 px-1">
        <div className="flex items-center justify-between gap-2">
          <Shimmer className="h-5 w-3/5 rounded-md" />
          <Shimmer className="h-4 w-12 rounded-md" />
        </div>
        <Shimmer className="h-3.5 w-2/5 rounded-md" />
      </div>

      {/* Tags / chips */}
      <div className="flex gap-2 px-1 pt-1">
        <Shimmer className="h-6 w-16 rounded-full" />
        <Shimmer className="h-6 w-20 rounded-full" />
        <Shimmer className="h-6 w-14 rounded-full" />
      </div>

      {/* Price & action bar */}
      <div className="flex items-center justify-between px-1 pt-2 border-t border-slate-100 dark:border-white/5 mt-auto">
        <div className="space-y-1">
          <Shimmer className="h-3 w-12 rounded" />
          <Shimmer className="h-5 w-20 rounded" />
        </div>
        <Shimmer className="h-9 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function ShimmerBookingCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#13221f] space-y-4 ${className}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Shimmer className="h-6 w-24 rounded-lg" />
            <Shimmer className="h-5 w-16 rounded-full" />
          </div>
          <Shimmer className="h-5 w-3/4 rounded-md" />
          <Shimmer className="h-4 w-1/2 rounded-md" />
        </div>
        <Shimmer className="h-8 w-20 rounded-xl" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
        <div className="flex gap-2">
          <Shimmer className="h-4 w-28 rounded-md" />
        </div>
        <div className="flex gap-2">
          <Shimmer className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ShimmerMetricCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#13221f] space-y-3 ${className}`}
    >
      <div className="flex items-center justify-between">
        <Shimmer className="h-4 w-28 rounded-md" />
        <Shimmer className="h-9 w-9 rounded-xl" />
      </div>
      <Shimmer className="h-8 w-36 rounded-lg" />
      <Shimmer className="h-3.5 w-48 rounded" />
    </div>
  );
}

export function ShimmerTable({
  rows = 5,
  cols = 4,
  className = '',
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm dark:border-white/10 dark:bg-[#13221f] ${className}`}
    >
      {/* Table header */}
      <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
        {Array.from({ length: cols }).map((_, i) => (
          <Shimmer
            key={`th-${i}`}
            className={`h-4 rounded ${i === 0 ? 'w-1/3' : 'flex-1'}`}
          />
        ))}
      </div>

      {/* Table rows */}
      <div className="divide-y divide-slate-100 dark:divide-white/5">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={`tr-${r}`} className="flex items-center gap-4 px-6 py-4">
            {Array.from({ length: cols }).map((_, c) => (
              <Shimmer
                key={`cell-${r}-${c}`}
                className={`h-4 rounded ${c === 0 ? 'w-1/3 h-5' : 'flex-1'}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShimmerPage({
  title = 'Loading…',
  type = 'cards',
  className = '',
}: {
  title?: string;
  type?: 'cards' | 'table' | 'venue' | 'profile' | 'dashboard';
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`page w-full max-w-6xl mx-auto py-8 px-4 space-y-6 ${className}`}
    >
      {/* Visually hidden or accessible heading so tests and screen readers find it */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-lime-400 animate-pulse" />
            {title}
          </h1>
          <Shimmer className="h-4 w-64 rounded-md" />
        </div>
        <Shimmer className="h-10 w-28 rounded-xl" />
      </div>

      {/* Layout variants */}
      {type === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <ShimmerVenueCard key={i} />
          ))}
        </div>
      )}

      {type === 'table' && <ShimmerTable rows={6} cols={5} />}

      {type === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ShimmerMetricCard key={i} />
            ))}
          </div>
          <ShimmerTable rows={4} cols={4} />
        </div>
      )}

      {type === 'profile' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#13221f] flex items-center gap-5">
            <Shimmer className="w-20 h-20 rounded-full" />
            <div className="space-y-2.5 flex-1">
              <Shimmer className="h-6 w-48 rounded-lg" />
              <Shimmer className="h-4 w-32 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Shimmer className="h-48 rounded-3xl" />
            <Shimmer className="h-48 rounded-3xl" />
          </div>
        </div>
      )}

      {type === 'venue' && (
        <div className="space-y-6">
          <Shimmer className="h-80 w-full rounded-3xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Shimmer className="h-32 rounded-2xl" />
              <Shimmer className="h-48 rounded-2xl" />
            </div>
            <Shimmer className="h-80 rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
