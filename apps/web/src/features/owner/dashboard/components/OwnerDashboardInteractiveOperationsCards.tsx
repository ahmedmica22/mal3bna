import { Link } from 'react-router-dom';
import { Calendar, Clock, Building, DollarSign, ArrowRight, Layers } from 'lucide-react';
import type { OwnerDashboardContentProps } from '../types';

export function OwnerDashboardInteractiveOperationsCards({
  translate,
}: Pick<OwnerDashboardContentProps, 'translate'>) {
  return (
    <div>
      <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2 dark:text-slate-100">
        <Layers size={18} className="text-emerald-700 dark:text-lime-400" />
        <span>{translate('Operations & Management')}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/owner/calendar"
          className="group bg-white border border-slate-200 hover:border-lime-400/40 rounded-3xl p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white flex flex-col justify-between gap-4 dark:bg-[#13221f]/70 dark:border-white/10 dark:hover:bg-[#13221f]"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-lime-400/10 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-lime-400/20 transition-colors dark:text-lime-400">
              <Calendar size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 dark:text-slate-100">
              {translate('Interactive Schedule')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              {translate(
                'Courts as columns, hours as rows. View booked match slots and block maintenance windows.',
              )}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-200 text-xs font-bold text-emerald-700 flex items-center justify-between dark:border-white/5 dark:text-lime-400">
            <span>{translate('View Schedule')}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/owner/bookings"
          className="group bg-white border border-slate-200 hover:border-emerald-400/40 rounded-3xl p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white flex flex-col justify-between gap-4 dark:bg-[#13221f]/70 dark:border-white/10 dark:hover:bg-[#13221f]"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-400/10 text-emerald-700 flex items-center justify-center mb-3 group-hover:bg-emerald-400/20 transition-colors dark:text-emerald-400">
              <Clock size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 dark:text-slate-100">
              {translate('Match-Day Arrivals')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              {translate(
                'Check in arriving captains, collect cash due, report no-shows, and record walk-in games.',
              )}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-200 text-xs font-bold text-emerald-700 flex items-center justify-between dark:border-white/5 dark:text-emerald-400">
            <span>{translate('Manage Arrivals')}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/owner/venue"
          className="group bg-white border border-slate-200 hover:border-sky-400/40 rounded-3xl p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white flex flex-col justify-between gap-4 dark:bg-[#13221f]/70 dark:border-white/10 dark:hover:bg-[#13221f]"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-sky-400/10 text-sky-700 flex items-center justify-center mb-3 group-hover:bg-sky-400/20 transition-colors dark:text-sky-400">
              <Building size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 dark:text-slate-100">
              {translate('Venue & Court Setup')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              {translate(
                'Add 5v5/7v7/11v11 pitches or padel courts, set daytime and evening hourly rates, and adjust hours.',
              )}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-200 text-xs font-bold text-sky-700 flex items-center justify-between dark:border-white/5 dark:text-sky-400">
            <span>{translate('Setup Checklist')}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          to="/owner/balance"
          className="group bg-white border border-slate-200 hover:border-amber-400/40 rounded-3xl p-6 shadow-xl backdrop-blur-md transition-all hover:bg-white flex flex-col justify-between gap-4 dark:bg-[#13221f]/70 dark:border-white/10 dark:hover:bg-[#13221f]"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-400/10 text-amber-800 flex items-center justify-center mb-3 group-hover:bg-amber-400/20 transition-colors dark:text-amber-400">
              <DollarSign size={20} />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 dark:text-slate-100">
              {translate('Settlement & Money')}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed dark:text-slate-400">
              {translate(
                'Review online deposit releases, commission deductions, and track bank payout schedules.',
              )}
            </p>
          </div>
          <div className="pt-3 border-t border-slate-200 text-xs font-bold text-amber-800 flex items-center justify-between dark:border-white/5 dark:text-amber-400">
            <span>{translate('Check Balance')}</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
