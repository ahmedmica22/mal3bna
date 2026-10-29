import { Link } from 'react-router-dom';
import { ArrowRight, User, ShieldCheck } from 'lucide-react';
import type { OwnerDashboardContentProps } from '../types';

export function OwnerDashboardApprovedOwnerWithoutVenuePrompt({
  meQuery,
  profile,
  translate,
  venue,
}: Pick<OwnerDashboardContentProps, 'meQuery' | 'profile' | 'translate' | 'venue'>) {
  return (
    <>
      {meQuery.data?.status === 'active' && !venue && (
        <div className="bg-gradient-to-r from-emerald-50 dark:from-emerald-950/40 via-white dark:via-[#13221f]/90 to-teal-50 dark:to-teal-950/40 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Link
                to="/owner/profile"
                className="group relative shrink-0"
                title={translate('View & Edit Profile')}
              >
                {profile?.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt={profile.name || 'Owner Profile'}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-500/30 group-hover:border-lime-400 shadow-md transition-all group-hover:scale-105"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-lime-500/20 border-2 border-emerald-500/30 group-hover:border-lime-400 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-xl sm:text-2xl shadow-md transition-all group-hover:scale-105">
                    {profile?.name ? (
                      profile.name.slice(0, 2).toUpperCase()
                    ) : meQuery.data?.name ? (
                      meQuery.data.name.slice(0, 2).toUpperCase()
                    ) : (
                      <User size={28} />
                    )}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-lime-400 text-slate-950 p-1 rounded-full shadow-md group-hover:scale-110 transition-transform">
                  <User size={12} className="stroke-[2.5]" />
                </div>
              </Link>
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-emerald-400/20 text-emerald-700 border border-emerald-400/30 dark:text-emerald-300">
                  <ShieldCheck size={13} className="text-emerald-700 dark:text-emerald-400" />
                  {translate('Owner Account Approved')}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100">
                  {translate('Welcome,')} {profile?.name || meQuery.data?.name}
                  {translate('! Ready to send your venue info?')}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl dark:text-slate-300">
                  {translate(
                    'Your owner account is verified by the Super Admin. Please send your venue details and initial pitch setup to start receiving reservations.',
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/owner/profile"
                className="px-4 py-2.5 rounded-2xl text-xs font-black bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 transition-all text-center flex items-center justify-center gap-1.5 dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-100 dark:border-white/15"
              >
                <User size={14} />
                <span>{translate('My Profile')}</span>
              </Link>
              <Link
                to="/owner/venue"
                className="px-5 py-2.5 rounded-2xl text-xs font-black bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-lg shadow-lime-400/20 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{translate('Send Venue Info')}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
