import { BarChart3 } from 'lucide-react';
import type { OwnerMoneyContentProps } from '../types';
import { OwnerMoneyMoneyMetricCards } from '../components/OwnerMoneyMoneyMetricCards';
import { OwnerMoneyPayoutBatchesHistory } from '../components/OwnerMoneyPayoutBatchesHistory';

export function OwnerMoneyContent({
  locale,
  money,
  occupancy,
  payoutList,
  translate,
}: OwnerMoneyContentProps) {
  const ratePct =
    occupancy && typeof occupancy.rate === 'number' && Number.isFinite(occupancy.rate)
      ? (occupancy.rate * 100).toFixed(1)
      : '0.0';
  const booked =
    occupancy && typeof occupancy.bookedHours === 'number' && Number.isFinite(occupancy.bookedHours)
      ? occupancy.bookedHours
      : 0;
  const capacity =
    occupancy && typeof occupancy.totalHours === 'number' && Number.isFinite(occupancy.totalHours)
      ? occupancy.totalHours
      : 0;
  const numericRate = Math.min(100, Math.max(0, parseFloat(ratePct)));

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <p className="eyebrow text-xs font-black text-emerald-700 uppercase tracking-wider mb-1 dark:text-lime-400">
          {translate('OWNER SPACE • FINANCIAL LEDGER & PAYOUTS')}
        </p>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
          {translate('Your Revenue')}
        </h1>
      </div>

      {/* Money Metric Cards */}
      <OwnerMoneyMoneyMetricCards {...{ money, translate }} />

      {/* Pitch Occupancy Rate Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-5 dark:bg-[#13221f]/80 dark:border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-lime-400/15 flex items-center justify-center text-emerald-700 dark:text-lime-400">
              <BarChart3 size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 m-0">
                {translate('Pitch Occupancy Rate')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 m-0">
                {translate('Live utilization calculated against venue operating hours')}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full border border-slate-200 dark:border-white/10">
            {translate('Current Month')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Utilization Rate */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 dark:bg-[#0b1715]/70 dark:border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 dark:text-slate-400">
                {translate('Overall Court Utilization')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700 block tracking-tight dark:text-lime-400">
                  {ratePct}%
                </span>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  {numericRate > 50 ? translate('High Demand') : translate('Available Capacity')}
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-slate-200 dark:bg-white/10 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 dark:bg-lime-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${numericRate}%` }}
                />
              </div>
              <small className="text-[11px] text-slate-500 font-medium block mt-2 dark:text-slate-400">
                {translate('{{value0}}% of total active slots filled', { value0: ratePct })}
              </small>
            </div>
          </div>

          {/* Card 2: Booked Hours */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 dark:bg-[#0b1715]/70 dark:border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 dark:text-slate-400">
                {translate('Booked Hours')}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 block tracking-tight dark:text-slate-100">
                  {booked}
                </span>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {translate('hrs')}
                </span>
              </div>
            </div>
            <small className="text-[11px] text-slate-500 font-medium block mt-4 dark:text-slate-400">
              {translate('Confirmed player reservations & venue walk-ins')}
            </small>
          </div>

          {/* Card 3: Available Capacity */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 dark:bg-[#0b1715]/70 dark:border-white/5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2 dark:text-slate-400">
                {translate('Available Capacity')}
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-black text-slate-900 block tracking-tight dark:text-slate-100">
                  {capacity}
                </span>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                  {translate('hrs')}
                </span>
              </div>
            </div>
            <small className="text-[11px] text-slate-500 font-medium block mt-4 dark:text-slate-400">
              {translate('Total available court hours based on operating schedule')}
            </small>
          </div>
        </div>
      </div>

      {/* Payout Batches & History */}
      <OwnerMoneyPayoutBatchesHistory {...{ locale, payoutList, translate }} />
    </div>
  );
}
