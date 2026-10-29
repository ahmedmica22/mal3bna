import { Link } from 'react-router-dom';
import type { CheckoutConfirmationProps } from '../types';

export function CheckoutConfirmation({
  courtName,
  createdBooking,
  dueAtVenuePiastres,
  hours,
  translate,
  venueName,
}: CheckoutConfirmationProps) {
  return (
    <main className="page checkout max-w-xl mx-auto px-4 py-16 text-center">
      <div className="rounded-3xl border border-lime-400/40 bg-white p-8 sm:p-10 shadow-2xl backdrop-blur-md dark:bg-[#13221f]/90">
        <div className="w-16 h-16 rounded-full bg-lime-400/20 text-emerald-700 flex items-center justify-center text-3xl font-black mx-auto mb-4 border border-lime-400/30 animate-bounce dark:text-lime-400">
          ✓
        </div>
        <p className="eyebrow text-xs font-black text-emerald-700 tracking-wider uppercase mb-1 dark:text-lime-400">
          {translate('BOOKING CONFIRMED')}
        </p>
        {createdBooking.isTestPayment && (
          <p className="my-3 text-sm font-semibold text-amber-800 dark:text-amber-300">
            {translate('Test payment — no real money charged.')}
          </p>
        )}
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 dark:text-slate-100">
          {translate('Game on!')}
        </h1>
        <p className="text-sm text-slate-600 mb-6 dark:text-slate-300">
          {translate('Your reservation at')}{' '}
          <strong className="text-slate-900 dark:text-white">{venueName}</strong>{' '}
          {translate('is locked in. Show this code when you arrive at the pitch.')}
        </p>

        <div className="bg-emerald-50 dark:bg-black/50 border-2 border-dashed border-emerald-300 dark:border-lime-400 rounded-2xl p-6 mb-6">
          <span className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-1 dark:text-slate-400">
            {translate('Authoritative Booking Code')}
          </span>
          <div className="text-3xl sm:text-4xl font-black tracking-widest font-mono text-emerald-700 my-2 select-all dark:text-lime-400">
            {createdBooking.bookingCode ?? createdBooking.id.slice(0, 8).toUpperCase()}
          </div>
          <div className="text-xs text-slate-600 font-medium dark:text-slate-300">
            {courtName} · {hours} {translate('consecutive hour')}
            {hours > 1 ? translate('s') : ''}
          </div>
          {dueAtVenuePiastres > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-amber-800 font-semibold dark:border-white/10 dark:text-amber-300">
              {translate('💵 Remaining due at venue:')}{' '}
              <strong>
                {(dueAtVenuePiastres / 100).toFixed(0)} {translate('EGP')}
              </strong>{' '}
              {translate('(Cash)')}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-center flex-wrap">
          <Link
            className="button px-6 py-2.5 rounded-full text-xs font-bold bg-lime-400 text-slate-950 shadow-md shadow-lime-400/25"
            to="/bookings"
          >
            {translate('View in My Bookings →')}
          </Link>
          <Link
            className="button px-6 py-2.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-100 border border-slate-200 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15 dark:border-white/10"
            to="/"
          >
            {translate('Back to Home')}
          </Link>
        </div>
      </div>
    </main>
  );
}
