import { Wallet, Clock, TrendingUp, CheckCircle2, HandCoins } from 'lucide-react';
import type { OwnerMoneyContentProps } from '../types';

export function OwnerMoneyMoneyMetricCards({
  money,
  translate,
}: Pick<OwnerMoneyContentProps, 'money' | 'translate'>) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Available Balance */}
      <div className="bg-white border border-lime-400/30 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden dark:bg-[#13221f]/80">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            {translate('Available Balance')}
          </span>
          <div className="w-8 h-8 rounded-full bg-lime-400/15 flex items-center justify-center text-emerald-700 dark:text-lime-400">
            <Wallet size={16} />
          </div>
        </div>
        <strong className="text-2xl sm:text-3xl font-black text-emerald-700 block tracking-tight dark:text-lime-400">
          {((money.availablePiastres ?? 0) / 100).toFixed(2)} {translate('EGP')}
        </strong>
        <small className="text-xs text-slate-500 block mt-2 flex items-center gap-1 dark:text-slate-400">
          <CheckCircle2 size={12} className="text-emerald-700 dark:text-lime-400" />
          {translate('Ready for payout cycle')}
        </small>
      </div>

      {/* Cash Collected at Venue */}
      <div className="bg-white border border-emerald-500/30 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden dark:bg-[#13221f]/80">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            {translate('Cash Collected at Court')}
          </span>
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <HandCoins size={16} />
          </div>
        </div>
        <strong className="text-2xl sm:text-3xl font-black text-emerald-600 block tracking-tight dark:text-emerald-300">
          {((money.cashCollectedPiastres ?? 0) / 100).toFixed(2)} {translate('EGP')}
        </strong>
        <small className="text-xs text-slate-500 block mt-2 flex items-center gap-1 dark:text-slate-400">
          <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-300" />
          {translate('Retained directly in person')}
        </small>
      </div>

      {/* Total Historical Earnings */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md dark:bg-[#13221f]/80 dark:border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            {translate('Total Venue Revenue')}
          </span>
          <div className="w-8 h-8 rounded-full bg-sky-400/15 flex items-center justify-center text-sky-700 dark:text-sky-400">
            <TrendingUp size={16} />
          </div>
        </div>
        <strong className="text-2xl sm:text-3xl font-black text-sky-700 block tracking-tight dark:text-sky-400">
          {(
            (money.totalEarnedPiastres ??
              (money.releasedPiastres ?? 0) + (money.cashCollectedPiastres ?? 0)) / 100
          ).toFixed(2)}{' '}
          {translate('EGP')}
        </strong>
        <small className="text-xs text-slate-500 block mt-2 dark:text-slate-400">
          {translate('Online releases + Court gate cash')}
        </small>
      </div>

      {/* Pending Release */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md dark:bg-[#13221f]/80 dark:border-white/10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider dark:text-slate-400">
            {translate('Pending Release')}
          </span>
          <div className="w-8 h-8 rounded-full bg-amber-400/15 flex items-center justify-center text-amber-800 dark:text-amber-400">
            <Clock size={16} />
          </div>
        </div>
        <strong className="text-2xl sm:text-3xl font-black text-amber-800 block tracking-tight dark:text-amber-400">
          {((money.pendingPiastres ?? 0) / 100).toFixed(2)} {translate('EGP')}
        </strong>
        <small className="text-xs text-slate-500 block mt-2 dark:text-slate-400">
          {translate('Held until kickoff / match verification')}
        </small>
      </div>
    </div>
  );
}
