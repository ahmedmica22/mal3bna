import { DatePicker } from '../../../../components/ui/DatePicker';
import type { OwnerCalendarContentProps } from '../types';
import { OwnerCalendarInteractiveScheduleTableGrid } from '../components/OwnerCalendarInteractiveScheduleTableGrid';
import { BookingDetailsDialog } from '../components/BookingDetailsDialog';

export function OwnerCalendarContent({
  bookings,
  courts,
  hours,
  inspectedBooking,
  locale,
  selectedDate,
  setInspectedBooking,
  setSelectedDate,
  translate,
  venue,
}: OwnerCalendarContentProps) {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-20">
        <div>
          <p className="eyebrow text-xs font-black text-emerald-700 uppercase tracking-wider mb-1 dark:text-lime-400">
            {translate('OWNER SPACE • MATCH-DAY SCHEDULE')}
          </p>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
            {translate('Court Schedule')}
          </h1>
        </div>
        <div className="w-56">
          <DatePicker value={selectedDate} onChange={setSelectedDate} align="right" />
        </div>
      </div>

      {/* Toolbar / Legend */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 backdrop-blur-md dark:bg-[#13221f]/70 dark:border-white/10">
        <strong className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
          {venue?.name ?? translate('Venue')} {translate('• Africa/Cairo Time')}
        </strong>
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> {translate('Confirmed')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> {translate('Checked In')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" /> {translate('Completed')}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> {translate('No-Show')}
          </span>
        </div>
      </div>

      {/* Interactive Schedule Table / Grid */}
      <OwnerCalendarInteractiveScheduleTableGrid
        {...{ bookings, courts, hours, selectedDate, setInspectedBooking, translate }}
      />

      {/* Inspect Booking Modal */}
      {<BookingDetailsDialog {...{ inspectedBooking, locale, setInspectedBooking, translate }} />}
    </div>
  );
}
