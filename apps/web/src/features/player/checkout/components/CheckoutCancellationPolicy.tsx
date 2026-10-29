import { useLanguage } from '../../../../store/LanguageStore';
import { ShieldCheck } from 'lucide-react';

export function CheckoutCancellationPolicy() {
  const { translate } = useLanguage();
  const rules = [
    ['24+ hours before kickoff', 'Everything paid is refunded. No commission.'],
    [
      'Less than 24 hours before kickoff',
      'The 30% deposit is retained. Any amount paid above it is refunded.',
    ],
    ['Venue or admin cancellation', 'Everything paid is refunded.'],
  ] as const;
  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-[#13221f] sm:p-8">
      <h2 className="mb-6 flex items-center gap-3 text-lg font-extrabold">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-lime-300/10 dark:text-lime-300">
          <ShieldCheck size={19} />
        </span>
        {translate('Cancellation policy')}
      </h2>
      <ol className="space-y-5">
        {rules.map(([title, detail]) => (
          <li
            key={title}
            className="relative flex gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-white/[0.025]"
          >
            <span
              aria-hidden="true"
              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-emerald-600 dark:border-lime-300"
            />
            <div>
              <h3 className="text-sm font-bold">{translate(title)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {translate(detail)}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
