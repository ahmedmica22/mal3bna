import { useLanguage } from '../../store/LanguageStore';
import { Link } from 'react-router-dom';
import { Building2, Scale } from 'lucide-react';
import type { AdminVenue, AdminDispute } from '../../types/domain';
import { formatBasisPoints } from '../../utils/formatters';
import { StatusBadge } from '../ui/StatusBadge';

export function RecentVenuesCard({ venues }: { venues: AdminVenue[] }) {
  const { translate } = useLanguage();
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4 dark:bg-[#13221f]/80 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
          <Building2 size={16} className="text-emerald-700 dark:text-lime-400" />
          <span>{translate('Venues Roster')}</span>
        </h3>
        <Link
          to="/admin/venues"
          className="text-xs font-bold text-rose-700 hover:underline dark:text-rose-400"
        >
          {translate('View all (')}
          {venues.length}) →
        </Link>
      </div>

      <div className="divide-y divide-white/5 text-xs">
        {venues.length === 0 ? (
          <p className="py-6 text-center text-slate-500 dark:text-slate-400">
            {translate('No venues registered yet.')}
          </p>
        ) : (
          venues.slice(0, 4).map((v) => (
            <div key={v.id} className="py-3 flex items-center justify-between gap-3">
              <div className="truncate">
                <div className="font-extrabold text-slate-700 truncate dark:text-slate-200">
                  {v.name}
                </div>
                <div className="text-[11px] text-slate-500 truncate dark:text-slate-400">
                  {v.ownerEmail}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={v.status} size="sm" showIcon={false} />
                <span className="font-mono text-slate-500 font-bold dark:text-slate-400">
                  {formatBasisPoints(v.commissionBp, 1200)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function RecentDisputesCard({ disputes }: { disputes: AdminDispute[] }) {
  const { translate } = useLanguage();
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4 dark:bg-[#13221f]/80 dark:border-white/10">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
          <Scale size={16} className="text-amber-800 dark:text-amber-400" />
          <span>{translate('Disputes & Claims')}</span>
        </h3>
        <Link
          to="/admin/disputes"
          className="text-xs font-bold text-rose-700 hover:underline dark:text-rose-400"
        >
          {translate('View all (')}
          {disputes.length}) →
        </Link>
      </div>

      <div className="divide-y divide-white/5 text-xs">
        {disputes.length === 0 ? (
          <p className="py-6 text-center text-slate-500 dark:text-slate-400">
            {translate('No disputes reported.')}
          </p>
        ) : (
          disputes.slice(0, 4).map((d) => (
            <div key={d.id} className="py-3 flex items-center justify-between gap-3">
              <div className="truncate">
                <div className="font-mono font-bold text-amber-800 text-xs dark:text-amber-400">
                  {d.reservation?.bookingCode ?? translate('MLB-BOOKING')}
                </div>
                <div className="text-[11px] text-slate-500 truncate max-w-xs dark:text-slate-400">
                  {d.playerMessage}
                </div>
              </div>
              <StatusBadge status={d.status} size="sm" showIcon={false} className="shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
