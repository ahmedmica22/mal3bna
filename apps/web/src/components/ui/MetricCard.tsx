import React from 'react';
import { Link } from 'react-router-dom';
import type { MetricCardProps } from '../../types/ui';

export type { MetricCardProps };

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  href,
  tone = 'lime',
  onClick,
}: MetricCardProps) {
  const toneClasses = {
    lime: 'hover:border-lime-400/40 text-emerald-700 bg-lime-400/10 group-hover:bg-lime-400/20 dark:text-lime-400',
    emerald:
      'hover:border-emerald-400/40 text-emerald-700 bg-emerald-400/10 group-hover:bg-emerald-400/20 dark:text-emerald-400',
    amber:
      'hover:border-amber-400/40 text-amber-800 bg-amber-400/10 group-hover:bg-amber-400/20 dark:text-amber-400',
    sky: 'hover:border-sky-400/40 text-sky-700 bg-sky-400/10 group-hover:bg-sky-400/20 dark:text-sky-400',
    rose: 'hover:border-rose-400/40 text-rose-700 bg-rose-400/10 group-hover:bg-rose-400/20 dark:text-rose-400',
    purple:
      'hover:border-purple-400/40 text-purple-700 bg-purple-400/10 group-hover:bg-purple-400/20 dark:text-purple-400',
  }[tone];

  const content = (
    <div className="group bg-white border border-slate-200 rounded-3xl p-5 shadow-xl backdrop-blur-md transition-all hover:scale-[1.02] flex flex-col justify-between h-full dark:bg-[#13221f]/80 dark:border-white/10">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-500 tracking-wide dark:text-slate-400">
            {title}
          </span>
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${toneClasses}`}
          >
            {icon}
          </div>
        </div>
        <div className="text-2xl font-black text-slate-900 mb-1 tracking-tight truncate dark:text-slate-100">
          {value}
        </div>
      </div>
      {subtitle && (
        <div className="text-xs text-slate-500 mt-1 dark:text-slate-400">{subtitle}</div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="block h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-400/40 rounded-3xl"
      >
        {content}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={onClick ? 'cursor-pointer h-full' : 'h-full'}>
      {content}
    </div>
  );
}
