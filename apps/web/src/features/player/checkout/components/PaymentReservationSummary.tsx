import { CalendarDays, Clock3, MapPin, Ticket } from 'lucide-react';
import type { CheckoutPaymentProps } from '../types';

export function PaymentReservationSummary({
  createdBooking: booking,
  courtName,
  venueName,
  locale,
  translate,
}: CheckoutPaymentProps) {
  const full = booking.paymentOption === 'full';
  const formatMoney = (value: number) =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 2,
    }).format(value / 100);
  const date = new Intl.DateTimeFormat(locale, {
    timeZone: 'Africa/Cairo',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const time = new Intl.DateTimeFormat(locale, {
    timeZone: 'Africa/Cairo',
    hour: 'numeric',
    minute: '2-digit',
  });
  return (
    <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#13221f]">
        <div className="relative overflow-hidden border-b border-slate-200 bg-emerald-50 p-6 sm:p-8 dark:border-white/10 dark:bg-[#1a3027]">
          <div
            aria-hidden="true"
            className="absolute -end-12 -top-10 h-44 w-44 rounded-full border-[28px] border-emerald-600/5 dark:border-lime-300/5"
          />
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-600/15 bg-white/60 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-800 dark:border-lime-300/20 dark:bg-lime-300/10 dark:text-lime-300">
            <Ticket size={13} />
            {translate('Your match')}
          </span>
          <h2 className="relative text-2xl font-black tracking-tight text-slate-900 dark:text-white sm:text-3xl">
            {booking.venueName || venueName}
          </h2>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <MapPin size={15} className="shrink-0" />
            {booking.courtName || courtName}
          </p>
        </div>
        <div className="space-y-6 p-6 sm:p-8">
          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-200">
            <div className="flex items-start gap-3">
              <CalendarDays
                size={18}
                className="mt-0.5 shrink-0 text-emerald-600 dark:text-lime-300"
              />
              <div>
                <p className="font-semibold">
                  {booking.startsAt && !isNaN(new Date(booking.startsAt).getTime())
                    ? date.format(new Date(booking.startsAt))
                    : '—'}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {translate('Africa/Cairo time')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock3 size={18} className="shrink-0 text-emerald-600 dark:text-lime-300" />
              <span dir="ltr" className="font-semibold">
                {booking.startsAt &&
                booking.endsAt &&
                !isNaN(new Date(booking.startsAt).getTime()) &&
                !isNaN(new Date(booking.endsAt).getTime())
                  ? `${time.format(new Date(booking.startsAt))} – ${time.format(new Date(booking.endsAt))}`
                  : '—'}
              </span>
            </div>
          </div>
          <div className="space-y-3 border-t border-dashed border-slate-200 pt-5 text-sm dark:border-white/15">
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">
                {translate('Booking total')}
              </span>
              <strong className="text-slate-900 dark:text-white">
                {formatMoney(booking.totalPiastres)}
              </strong>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-slate-500 dark:text-slate-400">
                {translate('Due at venue')}
              </span>
              <strong className="text-slate-900 dark:text-white">
                {full
                  ? formatMoney(0)
                  : booking.dueAtVenuePiastres === undefined
                    ? '—'
                    : formatMoney(booking.dueAtVenuePiastres)}
              </strong>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-600/10 bg-emerald-50 p-5 dark:border-lime-300/15 dark:bg-lime-300/[0.07]">
            <p className="text-xs font-semibold text-emerald-800 dark:text-lime-200">
              {translate(full ? 'Pay in Full' : 'Pay Deposit (30%)')}
            </p>
            <p className="mt-2 text-3xl font-black tracking-tight text-emerald-900 dark:text-lime-300">
              {formatMoney(full ? booking.totalPiastres : booking.depositPiastres)}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
            {translate('Test payment — no real money charged.')}
          </p>
        </div>
      </section>
    </aside>
  );
}
