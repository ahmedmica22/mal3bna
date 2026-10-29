import { Lock } from 'lucide-react';

interface WebCardPreviewProps {
  cardNumber: string;
  cardHolder: string;
  expiry: string;
  translate: (key: string) => string;
}

export function WebCardPreview({
  cardNumber,
  cardHolder,
  expiry,
  translate,
}: WebCardPreviewProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 p-6 pb-5">
      {/* Decorative ambient circles */}
      <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-lime-400/10 pointer-events-none" />
      <div className="absolute -right-4 top-10 w-20 h-20 rounded-full bg-emerald-400/10 pointer-events-none" />

      <div className="relative flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-black text-lime-400 tracking-widest uppercase mb-1">
            {translate('SANDBOX PAYMENT')}
          </p>
          <p className="text-white/60 text-xs">{translate('Simulated — no real charge')}</p>
        </div>
        <Lock size={18} className="text-lime-400/60" />
      </div>

      {/* Card number preview */}
      <div className="font-mono text-white/90 text-lg tracking-[0.2em] mb-4 min-h-7">
        {cardNumber
          ? cardNumber.padEnd(19, ' ').replace(/ /g, ' ')
          : '•••• •••• •••• ••••'}
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
            {translate('Card Holder')}
          </p>
          <p className="text-white/90 text-sm font-semibold truncate max-w-[160px]">
            {cardHolder || '—'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-0.5">
            {translate('Expires')}
          </p>
          <p className="text-white/90 text-sm font-mono">{expiry || 'MM/YY'}</p>
        </div>
      </div>
    </div>
  );
}
