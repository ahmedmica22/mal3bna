import { Link } from 'react-router-dom';
import { Clock3, Info, ShieldCheck } from 'lucide-react';
import { FakeCardForm } from '../../../payments/FakeCardForm';
import { CheckoutFrame } from '../components/CheckoutFrame';
import { PaymentReservationSummary } from '../components/PaymentReservationSummary';
import type { CheckoutPaymentProps } from '../types';

export function CheckoutPayment(props: CheckoutPaymentProps) {
  const { bookingError, createdBooking, paymentOption, simulatePayment, timerText, translate } =
    props;
  return (
    <CheckoutFrame
      title={translate('Payment pending')}
      subtitle={translate('A final touch before kickoff.')}
      backTo="/bookings"
      backLabel={translate('View my bookings')}
      sidebar={<PaymentReservationSummary {...props} />}
    >
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-amber-500/15 bg-amber-50 px-5 py-4 dark:bg-amber-400/[0.06]">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-300">
            <Clock3 size={20} />
          </span>
          <div>
            <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
              {translate('Your slot is on hold')}
            </p>
            <p className="mt-0.5 hidden text-xs text-amber-800/70 dark:text-amber-200/60 sm:block">
              {translate('Complete payment before the countdown ends.')}
            </p>
          </div>
        </div>
        <span
          role="timer"
          aria-label={translate('Hold expires in')}
          className="shrink-0 rounded-xl bg-white/70 px-3 py-2 font-mono text-xl font-bold tabular-nums text-amber-900 dark:bg-black/15 dark:text-amber-200"
        >
          {timerText}
        </span>
      </div>
      <FakeCardForm
        onComplete={simulatePayment}
        paymentOption={paymentOption}
        amountPiastres={
          createdBooking.paymentOption === 'full'
            ? createdBooking.totalPiastres
            : createdBooking.depositPiastres
        }
      />
      {bookingError && (
        <p
          role="alert"
          className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-300"
        >
          {translate(bookingError)}
        </p>
      )}
      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/50 p-5 text-sm leading-relaxed text-slate-500 dark:border-white/5 dark:bg-white/[0.02] dark:text-slate-400">
        <Info size={18} className="mt-0.5 shrink-0" />
        <p>{translate('Use test card details. No real money will be charged.')}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 px-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-2">
          <ShieldCheck size={15} />
          {translate('FakeGateway test checkout')}
        </span>
        <Link
          to="/bookings"
          className="py-2 font-semibold underline decoration-slate-300 underline-offset-4 hover:text-emerald-700 focus-visible:outline focus-visible:outline-2 dark:hover:text-lime-300"
        >
          {translate('View my bookings')}
        </Link>
      </div>
    </CheckoutFrame>
  );
}
