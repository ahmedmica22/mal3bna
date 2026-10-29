import { occupiesVenueHour } from '../../../../utils/venue-time';
import type { OwnerCalendarContentProps } from '../types';

export function OwnerCalendarInteractiveScheduleTableGrid({
  bookings,
  courts,
  hours,
  selectedDate,
  setInspectedBooking,
  translate,
}: Pick<
  OwnerCalendarContentProps,
  'bookings' | 'courts' | 'hours' | 'selectedDate' | 'setInspectedBooking' | 'translate'
>) {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl backdrop-blur-md p-4 dark:border-white/10 dark:bg-[#0b1715]/90">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/10">
            <th className="p-3 text-start text-xs font-black text-emerald-700 uppercase tracking-wider w-24 dark:text-lime-400">
              {translate('Kickoff')}
            </th>
            {courts.map((court) => (
              <th
                key={court.id}
                className="p-3 text-start text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                <div className="flex items-center gap-1.5">
                  <span>{court.sport === 'padel' ? '🎾' : '⚽'}</span>
                  <span>{court.name}</span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {hours.map((hour) => (
            <tr key={hour} className="hover:bg-white/[0.02] transition-colors">
              <td className="p-3 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                {hour.toString().padStart(2, '0')}:00
              </td>
              {courts.map((court) => {
                const booking = bookings.find((item) => {
                  return (
                    (item.courtId === court.id || item.courtName === court.name) &&
                    !['cancelled', 'expired'].includes(item.status) &&
                    occupiesVenueHour(item.startsAt, item.endsAt, selectedDate, hour)
                  );
                });

                const getCellBadge = () => {
                  if (!booking) return null;
                  if (booking.status === 'confirmed')
                    return 'bg-emerald-500/20 border-emerald-500/40 text-emerald-700 hover:bg-emerald-500/30 dark:text-emerald-300';
                  if (booking.status === 'arrived')
                    return 'bg-sky-500/20 border-sky-500/40 text-sky-700 hover:bg-sky-500/30 dark:text-sky-300';
                  if (booking.status === 'completed')
                    return 'bg-slate-700/40 border-slate-600 text-slate-600 hover:bg-slate-700/60 dark:text-slate-300';
                  if (booking.status === 'no_show_pending')
                    return 'bg-amber-500/20 border-amber-500/40 text-amber-800 hover:bg-amber-500/30 dark:text-amber-300';
                  return 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-white/10 dark:border-white/20 dark:text-slate-300';
                };

                return (
                  <td key={`${hour}-${court.id}`} className="p-1.5">
                    {booking ? (
                      <button
                        type="button"
                        onClick={() => setInspectedBooking(booking)}
                        className={`w-full text-start p-2 rounded-xl border text-xs transition-all cursor-pointer shadow-sm ${getCellBadge()}`}
                      >
                        <span className="font-extrabold block truncate">
                          {booking.bookingCode ?? booking.customerName ?? translate('Reserved')}
                        </span>
                        <span className="text-[10px] opacity-75 capitalize block mt-0.5">
                          {translate(booking.status)}
                        </span>
                      </button>
                    ) : (
                      <div className="h-10 rounded-xl border border-dashed border-slate-200 flex items-center justify-center text-[10px] text-slate-600 font-medium dark:border-white/5">
                        {translate('Available')}
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
