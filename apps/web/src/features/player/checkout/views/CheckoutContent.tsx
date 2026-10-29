import { useEffect, useState } from 'react';
import { CalendarDays, Check, Clock3, Loader2, ShieldCheck, Ticket } from 'lucide-react';
import { CheckoutFrame } from '../components/CheckoutFrame';
import { CheckoutCancellationPolicy } from '../components/CheckoutCancellationPolicy';
import type { CheckoutContentProps } from '../types';

export function CheckoutContent(p: CheckoutContentProps) {
  const [accepted, setAccepted] = useState(false);
  useEffect(() => {
    setAccepted(false);
  }, [p.courtId, p.startsAt, p.hours, p.totalPiastres]);
  const money = (value: number) =>
    `${new Intl.NumberFormat(p.locale, { maximumFractionDigits: 2 }).format(value / 100)} ${p.translate('EGP')}`;
  const day = p.startsAt
    ? new Intl.DateTimeFormat(p.locale, {
        timeZone: 'Africa/Cairo',
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      }).format(new Date(p.startsAt))
    : '—';
  const timeFormat = new Intl.DateTimeFormat(p.locale, {
    timeZone: 'Africa/Cairo',
    hour: 'numeric',
    minute: '2-digit',
  });
  const disabled =
    !accepted ||
    p.isSubmitting ||
    !p.quote.data ||
    !p.courtId ||
    !p.startsAt ||
    Boolean(p.user && p.user.role !== 'player');
  return (
    <CheckoutFrame
      title={p.translate('Checkout')}
      subtitle={p.translate('Your next match, all in one place.')}
      backTo={p.venueId ? `/venues/${p.venueId}` : '/'}
      backLabel={p.translate('Back to Venue')}
      footer={
        <>
          <div className="hidden space-y-5 lg:block">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-emerald-700 dark:text-lime-300">
              <Ticket size={15} />
              {p.translate('Booking summary')}
            </p>
            <h2 className="text-xl font-extrabold">{p.venueName}</h2>
            <div className="space-y-3 border-b border-slate-200 pb-5 text-sm dark:border-white/10">
              <p className="flex justify-between gap-4 text-slate-500 dark:text-slate-400">
                <span>{p.translate('Booking total')}</span>
                <strong className="text-slate-900 dark:text-white">
                  {p.quote.isLoading ? '…' : money(p.totalPiastres)}
                </strong>
              </p>
              <p className="flex justify-between gap-4 text-slate-500 dark:text-slate-400">
                <span>{p.translate('Due at venue')}</span>
                <strong className="text-slate-900 dark:text-white">
                  {p.quote.isLoading ? '…' : money(p.dueAtVenuePiastres)}
                </strong>
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-5 dark:bg-lime-300/[0.07]">
              <p className="text-xs font-semibold text-emerald-800 dark:text-lime-200">
                {p.translate('Pay now')}
              </p>
              <p className="mt-2 text-3xl font-black tracking-tight text-emerald-900 dark:text-lime-300">
                {p.quote.isLoading ? '…' : money(p.dueNowPiastres)}
              </p>
            </div>
          </div>
          <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-[20px] border border-slate-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-white/[0.03]">
            <span className="text-sm font-semibold leading-relaxed">
              {p.translate('I accept the cancellation policy')}
            </span>
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center">
              <input
                type="checkbox"
                checked={accepted}
                onChange={(event) => setAccepted(event.target.checked)}
                disabled={p.isSubmitting}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <span className="flex h-9 w-9 items-center justify-center rounded-xl border-2 border-slate-400 text-transparent peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-emerald-400/30 dark:peer-checked:border-lime-300 dark:peer-checked:bg-lime-300 dark:peer-checked:text-slate-950">
                <Check size={22} strokeWidth={3} />
              </span>
            </span>
          </label>
          <button
            type="button"
            aria-label={p.translate('Reserve and continue to payment')}
            disabled={disabled}
            onClick={() => void p.reserveBooking()}
            className="flex min-h-16 w-full items-center justify-center gap-3 rounded-full bg-emerald-600 px-6 py-4 text-lg font-black text-white transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-lime-300 dark:text-[#10241b] dark:hover:bg-lime-200"
          >
            {p.isSubmitting ? (
              <>
                <Loader2 size={21} className="animate-spin" />
                {p.translate('Reserving your slot…')}
              </>
            ) : !p.user ? (
              p.translate('Sign In & Reserve')
            ) : (
              p.translate('Pay {{amount}} & book', { amount: money(p.dueNowPiastres) })
            )}
          </button>
          <p className="hidden items-center justify-center gap-2 text-center text-xs leading-relaxed text-slate-500 dark:text-slate-400 lg:flex">
            <ShieldCheck size={15} className="shrink-0" />
            {p.translate('Test payment — no real money charged.')}
          </p>
        </>
      }
    >
      <section className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#13221f] sm:p-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -end-10 -top-14 h-44 w-44 rounded-full border-[24px] border-emerald-500/[0.04] dark:border-lime-300/[0.04]"
        />
        <p className="mb-6 flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold tracking-wide text-emerald-800 dark:bg-lime-300/10 dark:text-lime-200">
          <CalendarDays size={14} />
          {day}
        </p>
        <h2 className="relative text-2xl font-extrabold tracking-tight sm:text-3xl">
          {p.venueName}
        </h2>
        <p className="mt-3 flex items-center gap-2 text-xl font-bold sm:text-2xl" dir="ltr">
          <Clock3 size={19} className="shrink-0 text-emerald-700 dark:text-lime-300" />
          {p.startsAt
            ? `${timeFormat.format(new Date(p.startsAt))} – ${timeFormat.format(new Date(Date.parse(p.startsAt) + p.hours * 3_600_000))}`
            : '—'}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {p.courtName} · {p.hours} {p.translate(p.hours === 1 ? 'Hour' : 'Hours')} ·{' '}
          {p.translate('Africa/Cairo time')}
        </p>
        <div className="!mt-6 overflow-hidden rounded-[20px] bg-slate-50 dark:bg-white/[0.03]">
          {[
            { label: p.translate('Booking total'), value: p.totalPiastres },
            { label: p.translate('Pay now'), value: p.dueNowPiastres },
            { label: p.translate('Due at venue'), value: p.dueAtVenuePiastres },
          ].map((row, index) => (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-4 px-5 py-5 ${index === 0 ? 'bg-emerald-50 dark:bg-lime-300/[0.07]' : 'border-t border-slate-200 dark:border-white/10'}`}
            >
              <span className="text-sm text-slate-600 dark:text-slate-300">{row.label}</span>
              <strong className={index === 0 ? 'text-xl font-extrabold' : 'text-base font-medium'}>
                {p.quote.isLoading ? '…' : money(row.value)}
              </strong>
            </div>
          ))}
        </div>
      </section>
      <div
        role="radiogroup"
        aria-label={p.translate('Payment option')}
        className="grid grid-cols-2 gap-3"
      >
        {(['deposit', 'full'] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={p.paymentOption === option}
            disabled={p.isSubmitting}
            onClick={() => p.setPaymentOption(option)}
            className={`min-h-24 rounded-[22px] border p-4 text-start text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 sm:p-5 ${p.paymentOption === option ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-lime-300 dark:bg-lime-300/[0.07] dark:text-lime-300' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-400/40 dark:border-white/10 dark:bg-[#13221f] dark:text-slate-300'}`}
          >
            <span className="flex items-center justify-between gap-2">
              {p.translate(option === 'deposit' ? '30% deposit' : 'Pay in full')}
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${p.paymentOption === option ? 'border-emerald-600 bg-emerald-600 text-white dark:border-lime-300 dark:bg-lime-300 dark:text-slate-950' : 'border-slate-300 dark:border-white/20'}`}
              >
                {p.paymentOption === option && <Check size={12} strokeWidth={3} />}
              </span>
            </span>
            <span className="mt-3 block text-lg font-extrabold">
              {p.quote.isLoading
                ? '…'
                : money(option === 'deposit' ? p.depositPiastres : p.totalPiastres)}
            </span>
          </button>
        ))}
      </div>
      <CheckoutCancellationPolicy />
      <p className="px-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {p.translate('Test payment — no real money charged.')}
      </p>
      {p.quote.isError && (
        <p
          role="alert"
          className="rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-300"
        >
          {p.translate('Price unavailable. Please return to the venue and retry.')}
        </p>
      )}
      {p.bookingError && (
        <p
          role="alert"
          className="rounded-2xl bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-300"
        >
          {p.translate(p.bookingError)}
        </p>
      )}
    </CheckoutFrame>
  );
}
