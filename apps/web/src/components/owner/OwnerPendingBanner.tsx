import { useLanguage } from '../../store/LanguageStore';
import { Clock } from 'lucide-react';
import type { OwnerPendingBannerProps } from '../../types/ui';

export type { OwnerPendingBannerProps };

export function OwnerPendingBanner({
  userName,
  onRefresh,
  compact = false,
}: OwnerPendingBannerProps) {
  const { translate } = useLanguage();
  if (compact) {
    return (
      <div className="bg-gradient-to-r from-amber-50 dark:from-amber-950/40 via-white dark:via-[#13221f]/90 to-amber-50 dark:to-amber-950/40 border border-amber-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-amber-400/15 text-amber-800 border border-amber-400/25 dark:text-amber-300">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              {translate('Owner Request Under Review')}
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {translate('Welcome,')} {userName ?? translate('Partner')}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl dark:text-slate-300">
              {translate(
                'Your request to register as a venue owner is currently pending approval by the Super Admin. You will be able to send your venue info, courts, and prices as soon as your account is approved.',
              )}
            </p>
          </div>
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="px-5 py-2.5 rounded-2xl text-xs font-black bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{translate('Refresh Status')}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-12 bg-gradient-to-b from-[#13221f] to-[#0b1715] border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md text-center space-y-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-800 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10 dark:text-amber-400">
        <Clock size={32} />
      </div>
      <div className="space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-amber-400/15 text-amber-800 border border-amber-400/25 dark:text-amber-300">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          {translate('Owner Request Under Review')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
          {translate('Awaiting Super Admin Approval')}
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed dark:text-slate-300">
          {translate('Your request to register as a venue owner on')}{' '}
          <span className="text-emerald-700 font-bold dark:text-lime-400">
            {translate('mal3bna')}
          </span>{' '}
          {translate(
            'has been submitted to the Super Admin. Once approved, you will be able to set up and send your venue info, courts, and match-day rates.',
          )}
        </p>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="button px-6 py-2.5 rounded-full text-xs font-black bg-slate-100 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all cursor-pointer inline-flex items-center gap-2 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:border-white/10"
        >
          <span>{translate('Refresh Approval Status')}</span>
        </button>
      )}
    </div>
  );
}
