import { useLanguage } from '../../store/LanguageStore';
import { useState, useCallback, useId } from 'react';
import { CreditCard, Lock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { PaymentCardPreview } from './PaymentCardPreview';
import { detectBrand, WebCardBrandBadge } from './WebCardBrandBadge';

// Card number that simulates failure (test magic number)
const FAILURE_CARD = '4000000000000002';

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

export function FakeCardForm({
  onComplete,
  paymentOption,
  amountPiastres,
}: {
  onComplete: (status: 'success' | 'failure' | 'pending') => void | Promise<void>;
  paymentOption?: 'deposit' | 'full';
  amountPiastres?: number;
}) {
  const { translate } = useLanguage();
  const fieldId = useId();

  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<'idle' | 'success' | 'failure'>('idle');
  const [touched, setTouched] = useState({ card: false, expiry: false, cvv: false, holder: false });
  const [shake, setShake] = useState(false);

  const rawCard = cardNumber.replace(/\s/g, '');
  const brand = detectBrand(cardNumber);
  const isFailureCard = rawCard === FAILURE_CARD;

  // Validation
  const cardValid = rawCard.length === 16;
  const expiryValid =
    /^\d{2}\/\d{2}$/.test(expiry) &&
    (() => {
      const parts = expiry.split('/').map(Number);
      const mm = parts[0] ?? 0;
      const yy = parts[1] ?? 0;
      const now = new Date();
      const exp = new Date(2000 + yy, mm - 1, 1);
      return mm >= 1 && mm <= 12 && exp > now;
    })();
  const cvvValid = /^\d{3}$/.test(cvv);
  const holderValid = cardHolder.trim().length >= 3;
  const formValid = cardValid && expiryValid && cvvValid && holderValid;

  const triggerSimulate = async (outcome: 'success' | 'failure' | 'pending') => {
    if (busy) return;
    setBusy(true);
    try {
      await onComplete(outcome);
      setResult(outcome === 'pending' ? 'idle' : outcome);
    } catch {
      setResult('failure');
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    setTouched({ card: true, expiry: true, cvv: true, holder: true });
    if (!formValid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      const outcome = isFailureCard ? 'failure' : 'success';
      await onComplete(outcome);
      setResult(outcome);
    } catch {
      setResult('failure');
    } finally {
      setBusy(false);
    }
  }, [formValid, busy, isFailureCard, onComplete]);

  const labelClass = 'mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200';
  const inputClass = (valid: boolean, show: boolean) =>
    `min-h-12 w-full rounded-2xl border px-4 py-3.5 text-base bg-slate-50 dark:bg-[#0c1916] text-slate-900 dark:text-slate-100 placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-emerald-500/25 dark:focus:ring-lime-400/25 ${
      show && !valid
        ? 'border-rose-400/60 focus:border-rose-400'
        : 'border-slate-200 dark:border-white/10 focus:border-lime-400/60'
    }`;

  return (
    <section
      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-[#13221f] dark:shadow-black/10"
      style={{ animation: shake ? 'shake 0.4s ease' : undefined }}
    >
      <div className="border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5 dark:border-white/10 dark:from-[#172b24] dark:to-[#13221f] sm:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              {translate('Pay by card')}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {translate('Simulated — no real charge')}
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 p-3 text-emerald-700 dark:bg-lime-300/10 dark:text-lime-300">
            <CreditCard size={20} />
          </span>
        </div>
        <PaymentCardPreview number={cardNumber} holder={cardHolder} expiry={expiry} />
      </div>
      {/* Amount bar */}
      {amountPiastres !== undefined && (
        <div className="flex items-center justify-between px-6 py-3 bg-lime-400/10 border-b border-lime-400/20">
          <span className="text-xs font-bold text-emerald-700 dark:text-lime-300 uppercase tracking-wide">
            {paymentOption === 'full' ? translate('Pay in Full') : translate('Pay Deposit (30%)')}
          </span>
          <span className="text-lg font-black text-emerald-700 dark:text-lime-400 font-mono">
            {(amountPiastres / 100).toFixed(2)} <span className="text-sm">EGP</span>
          </span>
        </div>
      )}

      {/* Form */}
      <form
        className="space-y-5 p-6 sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit();
        }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {translate('Payment details')}
          </h2>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            {translate('Use test card details. No real money will be charged.')}
          </p>
        </div>
        {/* Card number */}
        <div>
          <label htmlFor={`${fieldId}-number`} className={labelClass}>
            {translate('Card Number')}
          </label>
          <div className="relative">
            <input
              id={`${fieldId}-number`}
              aria-invalid={touched.card && !cardValid}
              type="text"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              value={cardNumber}
              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, card: true }))}
              className={inputClass(cardValid, touched.card) + ' pe-14 font-mono'}
              autoComplete="cc-number"
              disabled={busy || result === 'success'}
            />
            <span className="absolute end-4 top-1/2 -translate-y-1/2 flex items-center">
              <WebCardBrandBadge brand={brand} />
            </span>
          </div>
          {touched.card && !cardValid && (
            <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">
              {translate('Enter a valid 16-digit card number')}
            </p>
          )}
          {isFailureCard && (
            <p className="text-amber-600 dark:text-amber-400 text-xs mt-1 flex items-center gap-1">
              <AlertTriangle size={12} />
              {translate('Test failure card — payment will be declined')}
            </p>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${fieldId}-expiry`} className={labelClass}>
              {translate('Expiry')}
            </label>
            <input
              id={`${fieldId}-expiry`}
              aria-invalid={touched.expiry && !expiryValid}
              type="text"
              inputMode="numeric"
              placeholder="MM/YY"
              maxLength={5}
              value={expiry}
              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
              onBlur={() => setTouched((t) => ({ ...t, expiry: true }))}
              className={inputClass(expiryValid, touched.expiry)}
              autoComplete="cc-exp"
              disabled={busy || result === 'success'}
            />
            {touched.expiry && !expiryValid && (
              <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">
                {translate('Invalid expiry')}
              </p>
            )}
          </div>
          <div>
            <label htmlFor={`${fieldId}-cvv`} className={labelClass}>
              {translate('CVV')}
            </label>
            <input
              id={`${fieldId}-cvv`}
              aria-invalid={touched.cvv && !cvvValid}
              type="password"
              inputMode="numeric"
              placeholder="•••"
              maxLength={3}
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
              onBlur={() => setTouched((t) => ({ ...t, cvv: true }))}
              className={inputClass(cvvValid, touched.cvv)}
              autoComplete="cc-csc"
              disabled={busy || result === 'success'}
            />
            {touched.cvv && !cvvValid && (
              <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">
                {translate('Enter exactly 3 digits')}
              </p>
            )}
          </div>
        </div>

        {/* Cardholder name */}
        <div>
          <label htmlFor={`${fieldId}-holder`} className={labelClass}>
            {translate('Cardholder Name')}
          </label>
          <input
            id={`${fieldId}-holder`}
            aria-invalid={touched.holder && !holderValid}
            type="text"
            placeholder="AHMED HASSAN"
            value={cardHolder}
            onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
            onBlur={() => setTouched((t) => ({ ...t, holder: true }))}
            className={inputClass(holderValid, touched.holder)}
            autoComplete="cc-name"
            disabled={busy || result === 'success'}
          />
          {touched.holder && !holderValid && (
            <p className="text-rose-500 dark:text-rose-400 text-xs mt-1">
              {translate('Enter the name on your card')}
            </p>
          )}
        </div>

        {/* Submit button */}
        {result !== 'success' && (
          <button
            type="submit"
            disabled={busy}
            className="w-full mt-2 rounded-2xl py-4 bg-lime-400 text-slate-900 font-black text-base tracking-wide hover:bg-lime-300 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-lg shadow-lime-400/25"
          >
            {busy ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  />
                </svg>
                {translate('Processing payment…')}
              </>
            ) : (
              <>
                <Lock size={16} />
                {translate(result === 'failure' ? 'Retry payment' : 'Complete test payment')}
                {amountPiastres !== undefined && (
                  <span className="ms-1 font-mono">· {(amountPiastres / 100).toFixed(2)} EGP</span>
                )}
              </>
            )}
          </button>
        )}

        {/* Quick sandbox simulation buttons */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2">
          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            {translate('Quick Test Simulation')}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void triggerSimulate('success')}
              className="flex-1 p-2.5 rounded-xl border border-lime-400/30 bg-lime-400/10 hover:bg-lime-400/20 text-emerald-700 dark:text-lime-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>
                {busy
                  ? translate('Confirming test payment…')
                  : translate(paymentOption === 'full' ? 'Pay 100% online' : 'Pay 30% deposit')}
              </span>
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void triggerSimulate('failure')}
              className="p-2.5 px-3 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <XCircle size={14} />
              <span>{translate('Simulate Failure')}</span>
            </button>
          </div>
        </div>

        {/* Result states */}
        {result === 'success' && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-lime-400/15 border border-lime-400/40 text-emerald-700 dark:text-lime-300 font-bold">
            <CheckCircle2 size={22} />
            <div>
              <p>{translate('Payment submitted')}</p>
              <p className="text-xs font-normal opacity-70">
                {translate('Checking your booking confirmation…')}
              </p>
            </div>
          </div>
        )}
        {result === 'failure' && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-300 font-bold">
            <XCircle size={22} />
            <div>
              <p>{translate('Payment failed')}</p>
              <p className="text-xs font-normal opacity-70">
                {translate('Check your card details and try again.')}
              </p>
            </div>
          </div>
        )}

        {/* Security note */}
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center justify-center gap-1.5">
          <Lock size={10} />
          {translate('Test payment — no real money charged.')}
        </p>
      </form>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </section>
  );
}
