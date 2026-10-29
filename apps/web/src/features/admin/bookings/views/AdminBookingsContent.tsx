import { CalendarCheck, RefreshCw } from 'lucide-react';
import type { AdminBookingsContentProps } from '../types';
import { AdminBookingsKpiStatsRibbon } from '../components/AdminBookingsKpiStatsRibbon';
import { AdminBookingsInteractiveFilterSearchBarFullyResponsive } from '../components/AdminBookingsInteractiveFilterSearchBarFullyResponsive';
import { AdminBookingsTable } from '../components/AdminBookingsTable';

export function AdminBookingsContent({
  bookings,
  cairoDateTime,
  filteredItems,
  handleStatusFilter,
  hasFilters,
  isUpdating,
  page,
  result,
  searchTerm,
  setPage,
  setSearchTerm,
  stats,
  statusFilter,
  statusTone,
  translate,
}: AdminBookingsContentProps) {
  return (
    <section className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-gradient-to-r from-rose-950/30 via-[#13221f] to-[#0c1715] border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
              {translate('Platform operations')}
            </span>
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
              {translate('Africa/Cairo • Real-Time')}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight m-0">
            {translate('All court bookings')}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed m-0">
            {translate('Player, walk-in, and court-block reservations across every venue.')}
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10 w-full sm:w-auto justify-between sm:justify-end">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white/5 border border-white/10 text-slate-300">
            <CalendarCheck size={14} className="text-rose-400" />
            <span>
              {result.total} {translate('total reservations')}
            </span>
          </span>

          <button
            onClick={() => void bookings.refetch()}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold text-white transition-all cursor-pointer shadow-md"
          >
            <RefreshCw
              size={13}
              className={bookings.isFetching ? 'animate-spin text-lime-400' : ''}
            />
            <span>{translate('Refresh')}</span>
          </button>
        </div>
      </header>

      {/* KPI Stats Ribbon */}
      <AdminBookingsKpiStatsRibbon {...{ result, stats, translate }} />

      {/* Interactive Filter & Search Bar - Fully Responsive */}
      <AdminBookingsInteractiveFilterSearchBarFullyResponsive
        {...{ isUpdating, handleStatusFilter, searchTerm, setSearchTerm, statusFilter, translate }}
      />

      {/* Main Bookings Data Table */}
      {
        <AdminBookingsTable
          {...{
            cairoDateTime,
            filteredItems,
            hasFilters,
            isUpdating,
            page,
            result,
            setPage,
            statusTone,
            translate,
          }}
        />
      }
    </section>
  );
}
