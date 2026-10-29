import { useLanguage } from '../../store/LanguageStore';
import { useState } from 'react';
import { CheckCircle2, Clock3, XCircle } from 'lucide-react';

export function FakeGatewayPanel({
  onComplete,
  paymentOption,
  amountPiastres,
}: {
  onComplete: (status: 'success' | 'failure' | 'pending') => void | Promise<void>;
  paymentOption?: 'deposit' | 'full';
  amountPiastres?: number;
}) {
  const { translate } = useLanguage();
  const [state, setState] = useState<'idle' | 'success' | 'failure' | 'pending'>('idle');
  const [busy, setBusy] = useState(false);

  const choose = async (value: 'success' | 'failure' | 'pending') => {
    if (busy) return;
    setBusy(true);
    try {
      await onComplete(value);
      setState(value);
    } catch {
      setState('failure');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="payment-panel rounded-3xl border border-slate-200 bg-white backdrop-blur-md p-6 shadow-xl shadow-emerald-950/5 my-4 dark:border-white/10 dark:bg-[#13221f]/90 dark:shadow-black/20">
      <p className="eyebrow text-xs font-black text-emerald-700 tracking-wider uppercase mb-1 dark:text-lime-400">
        {translate('FAKEGATEWAY LOCAL CHECKOUT')}
      </p>
      <h2 className="text-xl font-bold text-slate-900 m-0 mb-2 dark:text-slate-100">
        {translate('Complete payment')}
      </h2>
      <p className="text-xs text-slate-500 mb-6 leading-relaxed dark:text-slate-400">
        {translate('Test payment — no real money charged.')}
      </p>
      {amountPiastres !== undefined && (
        <p className="mb-4 text-lg font-bold">
          {(amountPiastres / 100).toFixed(2)} {translate('EGP')}
        </p>
      )}

      <div className="payment-options grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          disabled={busy}
          className="payment-option p-4 rounded-2xl border border-lime-400/30 bg-lime-400/10 hover:bg-lime-400/20 text-emerald-700 font-bold text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] cursor-pointer dark:text-lime-300"
          onClick={() => void choose('success')}
        >
          <CheckCircle2 size={18} />
          <span>
            {busy
              ? translate('Confirming test payment…')
              : translate(paymentOption === 'full' ? 'Pay 100% online' : 'Pay 30% deposit')}
          </span>
        </button>

        {!paymentOption && (
          <button
            type="button"
            disabled={busy}
            className="payment-option p-4 rounded-2xl border border-lime-400/30 bg-lime-400/10 hover:bg-lime-400/20 text-emerald-700 font-bold text-sm flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] cursor-pointer dark:text-lime-300"
            onClick={() => void choose('success')}
          >
            <CheckCircle2 size={18} />
            <span>{translate('Pay 100% online')}</span>
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          disabled={busy}
          className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-semibold flex-1 flex items-center justify-center gap-1.5 transition-all cursor-pointer dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-400"
          onClick={() => void choose('pending')}
        >
          <Clock3 size={14} />
          <span>{translate('Simulate Pending')}</span>
        </button>

        <button
          type="button"
          disabled={busy}
          className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 text-xs font-semibold flex-1 flex items-center justify-center gap-1.5 transition-all cursor-pointer dark:text-rose-300"
          onClick={() => void choose('failure')}
        >
          <XCircle size={14} />
          <span>{translate('Simulate Failure')}</span>
        </button>
      </div>

      {state !== 'idle' && (
        <div
          className={`payment-result ${state} mt-4 p-3.5 rounded-2xl flex items-center gap-2.5 text-sm font-bold ${
            state === 'success'
              ? 'bg-lime-400/15 border border-lime-400/40 text-emerald-700 dark:text-lime-300'
              : state === 'pending'
                ? 'bg-amber-400/15 border border-amber-400/40 text-amber-800 dark:text-amber-300'
                : 'bg-rose-500/15 border border-rose-500/40 text-rose-700 dark:text-rose-300'
          }`}
        >
          {state === 'success' ? (
            <CheckCircle2 size={18} />
          ) : state === 'pending' ? (
            <Clock3 size={18} />
          ) : (
            <XCircle size={18} />
          )}
          <span>
            {state === 'success'
              ? translate('Payment confirmed')
              : state === 'pending'
                ? translate('Payment pending')
                : translate('Payment failed')}
          </span>
        </div>
      )}
    </section>
  );
}
