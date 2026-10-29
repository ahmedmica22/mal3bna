import { Wifi } from 'lucide-react';
import { useLanguage } from '../../store/LanguageStore';

export function PaymentCardPreview({
  number,
  holder,
  expiry,
}: {
  number: string;
  holder: string;
  expiry: string;
}) {
  const { translate } = useLanguage();
  const digits = number.replace(/\D/g, '');
  return (
    <div className="relative mx-auto aspect-[1.75] min-h-[220px] w-full max-w-[420px] overflow-hidden rounded-[24px] border border-white/15 bg-gradient-to-br from-[#344d42] via-[#1a342b] to-[#0d2019] p-5 text-white shadow-xl shadow-black/15 sm:min-h-[240px] sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -end-20 -top-24 h-80 w-80 rounded-full border-[40px] border-lime-200/[0.06]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -end-6 h-64 w-64 rounded-full border border-lime-200/15"
      />
      <div className="relative flex items-center justify-between">
        <span className="text-base font-black tracking-tight text-lime-200">
          mal3bna<span className="text-white/50">.</span>
        </span>
        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white/70">
          {translate('Test card')}
        </span>
      </div>
      <div className="relative mt-5 flex items-center gap-3 sm:mt-6">
        <span
          aria-hidden="true"
          className="grid h-8 w-10 grid-cols-3 gap-px overflow-hidden rounded-md border border-amber-200/40 bg-amber-200/60 p-1"
        >
          {Array.from({ length: 6 }, (_, index) => (
            <span key={index} className="rounded-sm border border-amber-950/30" />
          ))}
        </span>
        <Wifi size={23} className="rotate-90 text-white/45" aria-hidden="true" />
      </div>
      <p
        dir="ltr"
        className="relative mt-4 font-mono text-lg tracking-[0.18em] text-white/95 sm:text-2xl"
      >
        •••• •••• •••• {digits.length >= 4 ? digits.slice(-4) : '••••'}
      </p>
      <div className="relative mt-4 flex items-end justify-between gap-4 text-[10px] uppercase tracking-wider text-white/45">
        <div className="min-w-0">
          <p>{translate('Card Holder')}</p>
          <p className="mt-1 max-w-[220px] truncate text-xs font-semibold text-white/90">
            {holder || '—'}
          </p>
        </div>
        <div className="shrink-0 text-end">
          <p>{translate('Expires')}</p>
          <p className="mt-1 font-mono text-xs text-white/90">{expiry || 'MM/YY'}</p>
        </div>
      </div>
    </div>
  );
}
