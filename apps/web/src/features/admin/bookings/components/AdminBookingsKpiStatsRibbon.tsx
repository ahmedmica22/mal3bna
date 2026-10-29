import { CalendarCheck, CheckCircle2, Clock } from 'lucide-react';
import type { AdminBookingsContentProps } from '../types';

export function AdminBookingsKpiStatsRibbon({
  result,
  stats,
  translate,
}: Pick<AdminBookingsContentProps, 'result' | 'stats' | 'translate'>) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <div className="p-4 rounded-2xl bg-[#13221f] border border-white/10 shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>{translate('Total Count')}</span>
          <CalendarCheck size={14} className="text-slate-400" />
        </div>
        <div className="text-2xl font-black text-white">{result.total}</div>
        <span className="text-[11px] text-slate-500 block mt-0.5">
          {translate('Across all 27 Cairo zones')}
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-[#13221f] border border-white/10 shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>{translate('Confirmed Bookings')}</span>
          <CheckCircle2 size={14} className="text-emerald-400" />
        </div>
        <div className="text-2xl font-black text-emerald-400">{stats.confirmed}</div>
        <span className="text-[11px] text-emerald-300/70 block mt-0.5">
          {translate('Paid & ready for kickoff')}
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-[#13221f] border border-white/10 shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>{translate('Active Holds')}</span>
          <Clock size={14} className="text-amber-400" />
        </div>
        <div className="text-2xl font-black text-amber-400">{stats.held}</div>
        <span className="text-[11px] text-amber-300/70 block mt-0.5">
          {translate('10-minute hold window')}
        </span>
      </div>

      <div className="p-4 rounded-2xl bg-[#13221f] border border-white/10 shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>{translate('Gross Volume')}</span>
          <span className="text-xs font-bold text-lime-400">EGP</span>
        </div>
        <div className="text-2xl font-black text-lime-400">{stats.totalEgp}</div>
        <span className="text-[11px] text-slate-500 block mt-0.5">
          {translate('Across all bookings')}
        </span>
      </div>
    </div>
  );
}
