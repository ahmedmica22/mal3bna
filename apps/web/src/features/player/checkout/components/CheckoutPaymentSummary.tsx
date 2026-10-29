import { Link } from 'react-router-dom';
import { ShieldCheck, UserCheck } from 'lucide-react';
import type { CheckoutContentProps } from '../types';

export function CheckoutPaymentSummary({
  bookingError,
  courtId,
  dueAtVenuePiastres,
  dueNowPiastres,
  isSubmitting,
  quote,
  reserveBooking,
  startsAt,
  totalPiastres,
  translate,
  user,
}: Pick<
  CheckoutContentProps,
  | 'bookingError'
  | 'courtId'
  | 'dueAtVenuePiastres'
  | 'dueNowPiastres'
  | 'isSubmitting'
  | 'quote'
  | 'reserveBooking'
  | 'startsAt'
  | 'totalPiastres'
  | 'translate'
  | 'user'
>) {
  return (
    <div className="lg:col-span-5 space-y-4">
      <div className="rounded-2xl border border-white/10 bg-[#13221f] p-6 shadow-xl">
        <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-5">
          {translate('PRICE BREAKDOWN')}
        </h2>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{translate('Total Booking Rate')}</span>
            <strong className="text-sm font-bold text-white">
              {(totalPiastres / 100).toFixed(2)} {translate('EGP')}
            </strong>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400">{translate('Balance at Venue (Cash)')}</span>
            <strong className="text-sm font-bold text-white">
              {(dueAtVenuePiastres / 100).toFixed(2)} {translate('EGP')}
            </strong>
          </div>

          <hr className="my-4 border-white/10" />

          <div className="flex items-baseline justify-between pt-1">
            <span className="text-sm font-bold text-white">{translate('Due Right Now')}</span>
            <span className="text-2xl font-black text-lime-400 tracking-tight">
              {(dueNowPiastres / 100).toFixed(2)}{' '}
              <span className="text-xs font-bold text-slate-400 uppercase">{translate('EGP')}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        type="button"
        aria-label={translate('Reserve and continue to payment')}
        disabled={
          isSubmitting ||
          !quote.data ||
          !courtId ||
          !startsAt ||
          (Boolean(user) && user?.role !== 'player')
        }
        onClick={() => void reserveBooking()}
        className="w-full py-4 px-6 rounded-full bg-[#baf35e] hover:bg-[#a8e646] text-[#09110f] font-black text-sm tracking-wide shadow-[0_0_25px_rgba(186,243,94,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span>{translate('Confirming match reservation…')}</span>
        ) : !user ? (
          <span>{translate('Sign In & Reserve')}</span>
        ) : user.role !== 'player' ? (
          <span>{translate('Switch to Player Account to Reserve')}</span>
        ) : (
          <span>{translate('Reserve and continue to payment')}</span>
        )}
      </button>

      {/* Security note */}
      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 text-center">
        <ShieldCheck size={14} className="text-lime-400 shrink-0" />
        <span>{translate('Instant confirmation. Verified server pricing.')}</span>
      </div>

      {user && user.role !== 'player' && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
          <strong className="block text-sm font-bold mb-1">
            {translate('Signed in as Venue Owner')}
          </strong>
          <p className="m-0 leading-relaxed">
            {translate('You are currently logged in as an owner (')}
            <strong>{user.email}</strong>
            {translate('). Court bookings can only be reserved by player accounts.')}
          </p>
        </div>
      )}

      {!user && (
        <div className="rounded-2xl border border-sky-500/30 bg-sky-950/40 p-5 shadow-xl">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <UserCheck size={16} />
            </div>
            <div>
              <strong className="text-xs font-bold text-sky-300 block mb-0.5">
                {translate('Player Account Required')}
              </strong>
              <p className="text-[11px] text-slate-300 m-0 leading-relaxed">
                {translate('Please sign in or create an account to record your reservation.')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all flex-1 text-center"
              to={`/auth/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
            >
              {translate('Sign In')}
            </Link>
            <Link
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 transition-all flex-1 text-center font-extrabold shadow-md shadow-lime-400/20"
              to={`/auth/register?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`}
            >
              {translate('Register')}
            </Link>
          </div>
        </div>
      )}

      {bookingError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          <strong className="block text-sm font-bold mb-1">{translate('Booking error')}</strong>
          <p className="m-0">{translate(bookingError)}</p>
        </div>
      )}
    </div>
  );
}
