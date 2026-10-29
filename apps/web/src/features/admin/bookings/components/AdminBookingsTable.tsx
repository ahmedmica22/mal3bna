import { AdminBookingRow } from './AdminBookingRow';
import { CalendarCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatePanel } from '../../../../components/feedback/StatePanel';
import type { AdminBookingsContentProps } from '../types';

export function AdminBookingsTable({
  cairoDateTime,
  filteredItems,
  hasFilters,
  isUpdating,
  page,
  result,
  setPage,
  statusTone,
  translate,
}: Pick<
  AdminBookingsContentProps,
  | 'cairoDateTime'
  | 'filteredItems'
  | 'hasFilters'
  | 'isUpdating'
  | 'page'
  | 'result'
  | 'setPage'
  | 'statusTone'
  | 'translate'
>) {
  return (
    <>
      {isUpdating && filteredItems.length === 0 ? (
        <StatePanel title={translate('Loading all court bookings…')} />
      ) : filteredItems.length === 0 && !hasFilters ? (
        <StatePanel title={translate('No court bookings yet.')} />
      ) : filteredItems.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#13221f] p-12 text-center shadow-xl">
          <CalendarCheck size={36} className="text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-white mb-1">
            {translate('No matching reservations')}
          </h3>
          <p className="text-xs text-slate-400 m-0">
            {translate('Try clearing your search or status filter.')}
          </p>
        </div>
      ) : (
        <>
          <div
            aria-busy={isUpdating}
            className={`rounded-3xl border border-white/10 bg-[#13221f] shadow-2xl backdrop-blur-xl overflow-hidden transition-opacity duration-300 ${isUpdating ? 'opacity-70' : 'opacity-100'}`}
          >
            <table className="w-full table-fixed border-collapse text-start text-sm">
              <thead className="bg-black/40 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                <tr>
                  <th className="w-[14%] px-4 py-3.5 text-start font-black">
                    {translate('Booking')}
                  </th>
                  <th className="w-[20%] px-4 py-3.5 text-start font-black">
                    {translate('Venue / court')}
                  </th>
                  <th className="w-[18%] px-4 py-3.5 text-start font-black">
                    {translate('Player / customer')}
                  </th>
                  <th className="w-[18%] px-4 py-3.5 text-start font-black">
                    {translate('Kickoff (Cairo)')}
                  </th>
                  <th className="w-[13%] px-4 py-3.5 text-start font-black">
                    {translate('Status')}
                  </th>
                  <th className="w-[17%] px-4 py-3.5 text-end font-black">
                    {translate('Paid / total')}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredItems.map((booking) => (
                  <AdminBookingRow
                    key={booking.id}
                    booking={booking}
                    {...{ cairoDateTime, statusTone, translate }}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Navigation */}
          <nav
            aria-label={translate('Bookings pages')}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#13221f] border border-white/10 text-xs text-slate-400"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
              <span>
                {translate('Page')} <strong className="text-white">{result.page}</strong>{' '}
                {translate('of')}{' '}
                <strong className="text-white">{Math.max(result.totalPages, 1)}</strong>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-bold text-slate-300">
                {result.pageSize} {translate('per page')}
              </span>
              <span className="text-slate-500 hidden sm:inline">
                {' · '}
                {translate('auto-refreshes every 10 seconds')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={translate('Previous bookings page')}
                disabled={isUpdating || page <= 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={15} />
                <span>{translate('Previous')}</span>
              </button>
              <button
                type="button"
                aria-label={translate('Next bookings page')}
                disabled={isUpdating || page >= result.totalPages}
                onClick={() => setPage((current) => Math.min(result.totalPages, current + 1))}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
              >
                <span>{translate('Next')}</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </nav>
        </>
      )}
    </>
  );
}
