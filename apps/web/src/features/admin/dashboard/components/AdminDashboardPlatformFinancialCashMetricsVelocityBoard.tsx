import type { AdminDashboardContentProps } from '../types';
import { AdminDashboardFinancialKpiStatCards } from './AdminDashboardFinancialKpiStatCards';

export function AdminDashboardPlatformFinancialCashMetricsVelocityBoard({
  commissionEgp,
  finance,
  onlineVolumeEgp,
  totalGmvEgp,
  translate,
  venueCashEgp,
}: Pick<
  AdminDashboardContentProps,
  'commissionEgp' | 'finance' | 'onlineVolumeEgp' | 'totalGmvEgp' | 'translate' | 'venueCashEgp'
>) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#13221f] p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-96 h-96 bg-lime-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/10 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 shadow-[0_0_10px_#baf35e] animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-lime-400">
              {translate('Platform Financial Breakdown & Cash Operations')}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight m-0">
            {translate('Marketplace Revenue & Cash Flow')}
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-slate-300">
            {finance?.totalBookingsCount ?? 0} {translate('total bookings')}
          </span>
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-lime-400/10 border border-lime-400/30 text-lime-400">
            {translate('12.0% Platform Fee')}
          </span>
        </div>
      </div>

      {/* 4 Financial KPI Stat Cards */}
      <AdminDashboardFinancialKpiStatCards
        {...{ commissionEgp, finance, onlineVolumeEgp, totalGmvEgp, translate, venueCashEgp }}
      />

      {/* Visual Cash Flow Ratio Bar */}
      <div className="p-4 rounded-2xl bg-black/25 border border-white/5 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-300 mb-2.5">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span>
              {translate('Venue Cash (70%):')} {venueCashEgp}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            <span>
              {translate('Online Gateway (30%):')} {onlineVolumeEgp}
            </span>
          </span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
          <div
            style={{
              width: finance?.totalGmvPiastres
                ? `${Math.min(95, Math.max(5, (finance.venueCashCollectedPiastres / finance.totalGmvPiastres) * 100))}%`
                : '70%',
            }}
            className="bg-emerald-400 transition-all duration-500 rounded-s-full"
          />
          <div
            style={{
              width: finance?.totalGmvPiastres
                ? `${Math.min(95, Math.max(5, (finance.onlineVolumePiastres / finance.totalGmvPiastres) * 100))}%`
                : '30%',
            }}
            className="bg-sky-400 transition-all duration-500 rounded-e-full"
          />
        </div>
      </div>
    </div>
  );
}
