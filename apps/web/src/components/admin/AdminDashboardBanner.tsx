import { useLanguage } from '../../store/LanguageStore';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

export function AdminDashboardBanner() {
  const { translate } = useLanguage();
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-rose-50 dark:from-rose-950/40 via-white dark:via-[#13221f]/90 to-emerald-50 dark:to-emerald-950/40 border border-slate-200 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden dark:border-white/10">
      <div className="relative z-10 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-rose-500/20 text-rose-700 border border-rose-500/30 dark:text-rose-300">
            <Sparkles size={12} className="text-rose-700 dark:text-rose-400" />
            {translate('SUPER ADMIN CONSOLE')}
          </span>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-500 font-semibold dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {translate('Africa/Cairo • Live')}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
          {translate('Marketplace Control Center')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed dark:text-slate-400">
          {translate(
            'Oversee venue licensing, arbitrate player disputes, manage commission policy, and authorize batched financial settlements.',
          )}
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-2 self-stretch sm:self-auto">
        <Link
          to="/admin/venues"
          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs font-black bg-rose-500 hover:bg-rose-400 text-white shadow-lg shadow-rose-500/25 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span>{translate('Review Queues')}</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
