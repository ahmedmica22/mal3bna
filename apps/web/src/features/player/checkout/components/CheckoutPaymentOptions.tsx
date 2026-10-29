import { AlertTriangle } from 'lucide-react';
import type { CheckoutContentProps } from '../types';

export function CheckoutPaymentOptions({
  depositPiastres,
  isWithin24Hours,
  paymentOption,
  setPaymentOption,
  totalPiastres,
  translate,
}: Pick<
  CheckoutContentProps,
  | 'depositPiastres'
  | 'isWithin24Hours'
  | 'paymentOption'
  | 'setPaymentOption'
  | 'totalPiastres'
  | 'translate'
>) {
  return (
    <div>
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
        {translate('SELECT PAYMENT METHOD')}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* Option A: 30% DEPOSIT */}
        <button
          type="button"
          onClick={() => setPaymentOption('deposit')}
          className={`p-4 rounded-2xl border text-start transition-all cursor-pointer relative flex flex-col justify-between min-h-[140px] ${
            paymentOption === 'deposit'
              ? 'border-lime-400 bg-lime-400/5 ring-1 ring-lime-400/40 shadow-lg shadow-lime-400/10'
              : 'border-white/10 bg-[#13221f] hover:border-white/20'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-lime-400/15 text-lime-400 border border-lime-400/30">
                30% DEPOSIT
              </span>
              {paymentOption === 'deposit' && (
                <span className="w-5 h-5 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center text-xs font-black">
                  ✓
                </span>
              )}
            </div>
            <strong className="block text-sm font-bold text-white mb-1">
              {translate('Pay 30% Deposit Now')}
            </strong>
            <p className="text-xs text-slate-400 m-0">
              {translate('Pay remaining 70% in cash at venue.')}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs">
            <span className="text-slate-400">{translate('Due now')}</span>
            <strong className="text-sm font-black text-lime-400">
              {(depositPiastres / 100).toFixed(2)} {translate('EGP')}
            </strong>
          </div>
        </button>

        {/* Option B: 100% ONLINE */}
        <button
          type="button"
          onClick={() => setPaymentOption('full')}
          className={`p-4 rounded-2xl border text-start transition-all cursor-pointer relative flex flex-col justify-between min-h-[140px] ${
            paymentOption === 'full'
              ? 'border-lime-400 bg-lime-400/5 ring-1 ring-lime-400/40 shadow-lg shadow-lime-400/10'
              : 'border-white/10 bg-[#13221f] hover:border-white/20'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30">
                100% ONLINE
              </span>
              {paymentOption === 'full' && (
                <span className="w-5 h-5 rounded-full bg-lime-400 text-slate-950 flex items-center justify-center text-xs font-black">
                  ✓
                </span>
              )}
            </div>
            <strong className="block text-sm font-bold text-white mb-1">
              {translate('Pay 100% Online')}
            </strong>
            <p className="text-xs text-slate-400 m-0">
              {translate('Skip the cash queue at the pitch.')}
            </p>
          </div>

          <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs">
            <span className="text-slate-400">{translate('Due now')}</span>
            <strong className="text-sm font-black text-lime-400">
              {(totalPiastres / 100).toFixed(2)} {translate('EGP')}
            </strong>
          </div>
        </button>
      </div>

      {/* Cancellation policy banner */}
      <div className="rounded-2xl border border-amber-600/30 bg-[#231a0e] p-4 flex items-start gap-3 text-xs text-amber-200">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-300 font-bold mb-0.5">
            {translate('Cancellation policy:')}
          </strong>
          <p className="m-0 text-amber-200/90 leading-relaxed">
            {isWithin24Hours
              ? translate(
                  'Kickoff is within 24 hours. The online deposit is non-refundable if cancelled.',
                )
              : translate('Free cancellation with 100% refund up to 24 hours before kickoff.')}
          </p>
        </div>
      </div>
    </div>
  );
}
