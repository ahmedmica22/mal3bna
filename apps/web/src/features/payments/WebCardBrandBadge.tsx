import { CreditCard } from 'lucide-react';

export function detectBrand(num: string): 'visa' | 'mastercard' | 'amex' | 'unknown' {
  const d = num.replace(/\s/g, '');
  if (/^4/.test(d)) return 'visa';
  if (/^5[1-5]/.test(d)) return 'mastercard';
  if (/^3[47]/.test(d)) return 'amex';
  return 'unknown';
}

export function WebCardBrandBadge({ brand }: { brand: ReturnType<typeof detectBrand> }) {
  if (brand === 'visa') {
    return (
      <span className="text-xs font-black italic text-blue-400 tracking-widest uppercase px-2 py-0.5 rounded bg-blue-400/10 border border-blue-400/20">
        VISA
      </span>
    );
  }
  if (brand === 'mastercard') {
    return (
      <span className="flex items-center gap-0.5">
        <span className="w-4 h-4 rounded-full bg-red-500/80 inline-block" />
        <span className="w-4 h-4 rounded-full bg-yellow-400/80 -ml-2 inline-block" />
      </span>
    );
  }
  if (brand === 'amex') {
    return (
      <span className="text-xs font-black text-blue-300 tracking-widest uppercase px-2 py-0.5 rounded bg-blue-400/10 border border-blue-400/20">
        AMEX
      </span>
    );
  }
  return <CreditCard size={18} className="text-slate-400" />;
}
