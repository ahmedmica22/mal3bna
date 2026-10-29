import { Link } from 'react-router-dom';
import { ArrowUpRight, Banknote, Landmark, Wallet, CircleAlert, Clock3 } from 'lucide-react';
import type { OwnerDashboardContentProps } from '../types';

export function VenueEarnings({ balance, balanceLoading, balanceError, retryBalance, hasTestPayments, todayCashDue, money, translate }: Pick<OwnerDashboardContentProps, 'balance' | 'balanceLoading' | 'balanceError' | 'retryBalance' | 'hasTestPayments' | 'todayCashDue' | 'money' | 'translate'>) {
  if (balanceError) return <section role="alert" className="rounded-3xl border border-amber-300 bg-amber-50 p-6 text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200"><h2 className="font-bold">{translate('Earnings are unavailable')}</h2><p className="mt-2 text-sm">{translate('Your schedule is still available. Retry to load your venue balance.')}</p><button type="button" onClick={retryBalance} className="mt-4 min-h-11 rounded-xl border border-current px-4 text-sm font-bold">{translate('Retry earnings')}</button></section>;
  const value = (amount: number | undefined) => balanceLoading ? translate('Loading…') : money(amount);
  return <section aria-label={translate('Earnings overview')} className="grid min-w-0 gap-4 lg:grid-cols-[1.15fr_1fr]">
    <div className="relative overflow-hidden rounded-3xl bg-[#164b38] p-6 text-white sm:p-8 dark:bg-[#baf35e] dark:text-[#102a2b]">
      <div aria-hidden="true" className="pointer-events-none absolute -end-20 -top-24 h-72 w-72 rounded-full border-[32px] border-white/5 dark:border-emerald-950/5" />
      <div className="relative flex h-full flex-col justify-between gap-8">
        <div className="flex items-center justify-between gap-3"><span className="inline-flex items-center gap-2 text-xs font-bold"><Wallet size={18} aria-hidden="true" />{translate('Venue earnings')}</span><Link to="/owner/balance" className="rounded-full border border-current/20 p-2" aria-label={translate('View earnings details')}><ArrowUpRight size={18} aria-hidden="true" /></Link></div>
        <div aria-busy={balanceLoading}><p className="text-xs font-semibold opacity-75">{translate('Total recorded earnings')}</p><p className="mt-2 break-words text-3xl font-black tracking-tight sm:text-4xl xl:text-5xl" data-testid="venue-earnings">{value(balance?.totalEarnedPiastres)}</p><p className="mt-3 max-w-sm text-xs leading-relaxed opacity-80">{translate('Reported by your venue balance. Pending funds are shown separately.')}</p></div>
        <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-current/15 pt-4 text-xs"><span>{translate('Cash collected')}<strong className="mt-1 block text-base">{value(balance?.cashCollectedPiastres)}</strong></span><span>{translate('Collected today')}<strong className="mt-1 block text-base">{value(balance?.todayCashCollectedPiastres)}</strong></span></div>
        {hasTestPayments && <p className="flex items-start gap-2 rounded-xl bg-black/10 p-3 text-xs leading-relaxed"><CircleAlert size={15} className="shrink-0" aria-hidden="true" />{translate('Includes test payments. Simulated amounts are not real income.')}</p>}
      </div>
    </div>
    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
      {[
        { label: 'Available balance', amount: balance?.availablePiastres, detail: 'Current released venue balance', icon: Landmark, color: 'text-emerald-700 dark:text-lime-400' },
        { label: 'Pending funds', amount: balance?.pendingPiastres, detail: 'Awaiting financial release', icon: Clock3, color: 'text-amber-700 dark:text-amber-300' },
        { label: 'Cash due today', amount: todayCashDue, detail: 'Outstanding payments at your venue', icon: Banknote, color: 'text-sky-700 dark:text-sky-300' },
      ].map(({ label, amount, detail, icon: Icon, color }) => <Link key={label} to={label === 'Cash due today' ? '/owner/bookings' : '/owner/balance'} className="group flex flex-col justify-between gap-3 rounded-2xl lg:flex-row lg:items-center border border-slate-200 bg-white p-5 transition hover:border-emerald-400/50 dark:border-white/10 dark:bg-[#13221f]">
        <div className="flex items-center justify-between gap-2"><span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{translate(label)}</span><Icon size={17} aria-hidden="true" className={color} /></div>
        <div><p className="break-words text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">{label === 'Cash due today' ? money(amount) : value(amount)}</p><p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{translate(detail)}</p></div>
      </Link>)}
    </div>
  </section>;
}
import { Clock3 as ClockIcon } from 'lucide-react';
