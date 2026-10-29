import { ShieldAlert, CheckCircle2, AlertTriangle, Send } from 'lucide-react';
import type { ProfileContentProps } from '../types';

export function ProfileTrustStrikesBanner({
  activeStrikes,
  appealMessage,
  appealSubmitted,
  handleAppeal,
  isBlocked,
  isSubmittingAppeal,
  setAppealMessage,
  translate,
}: Pick<
  ProfileContentProps,
  | 'activeStrikes'
  | 'appealMessage'
  | 'appealSubmitted'
  | 'handleAppeal'
  | 'isBlocked'
  | 'isSubmittingAppeal'
  | 'setAppealMessage'
  | 'translate'
>) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-lg backdrop-blur-md transition-all ${
        isBlocked
          ? 'bg-rose-500/10 border-rose-500/50 dark:bg-rose-950/40 dark:border-rose-500/50'
          : activeStrikes.length > 0
            ? 'bg-amber-500/10 border-amber-500/50 dark:bg-amber-950/40 dark:border-amber-500/50'
            : 'bg-white border-slate-200 dark:bg-[#13221f]/80 dark:border-white/10'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
        <div className="flex items-center gap-2.5">
          {isBlocked ? (
            <ShieldAlert className="text-rose-700 dark:text-rose-400" size={24} />
          ) : activeStrikes.length > 0 ? (
            <AlertTriangle className="text-amber-700 dark:text-amber-400 animate-pulse" size={24} />
          ) : (
            <CheckCircle2 className="text-emerald-700 dark:text-lime-400" size={22} />
          )}
          <div>
            <strong
              className={`text-base font-extrabold block ${
                isBlocked
                  ? 'text-rose-700 dark:text-rose-400'
                  : activeStrikes.length > 0
                    ? 'text-amber-700 dark:text-amber-400'
                    : 'text-emerald-700 dark:text-lime-400'
              }`}
            >
              {isBlocked
                ? translate('Account Suspended (4 Strikes)')
                : activeStrikes.length > 0
                  ? translate('Strike Warning: {{value0}} of 4 Active Strikes', {
                      value0: activeStrikes.length,
                    })
                  : translate('Trust Status: Good Standing (0 Strikes)')}
            </strong>
            {activeStrikes.length > 0 && !isBlocked && (
              <span className="text-xs font-bold text-amber-700/80 dark:text-amber-300/80">
                {translate('Warning • Match No-Show Recorded')}
              </span>
            )}
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-slate-50 border border-slate-200 text-slate-500 dark:bg-black/40 dark:border-white/10 dark:text-slate-400">
          {translate('6-month expiry policy')}
        </span>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed max-w-3xl dark:text-slate-400 m-0">
        {translate(
          'Strikes are issued for unexcused no-shows. 4 active strikes block court bookings. Past match data and appeals remain fully accessible.',
        )}
      </p>

      {/* 4-Slot Visual Strike Meter */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 my-4">
        {[1, 2, 3, 4].map((slot) => {
          const isTriggered = slot <= activeStrikes.length;
          const isFatal = slot === 4;
          return (
            <div
              key={slot}
              className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all ${
                isTriggered
                  ? isFatal
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-700 dark:text-rose-400'
                    : 'bg-amber-500/20 border-amber-500/50 text-amber-800 dark:text-amber-300'
                  : 'bg-slate-50/70 border-slate-200 text-slate-400 dark:bg-white/5 dark:border-white/10 dark:text-slate-500'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {isTriggered ? (
                  <AlertTriangle
                    size={13}
                    className={
                      isFatal
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }
                  />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20" />
                )}
                <span className="text-xs font-black">
                  {translate('Strike {{slot}}', { slot: String(slot) })}
                </span>
              </div>
              <span className="text-[10px] font-bold block uppercase tracking-wider">
                {isTriggered
                  ? isFatal
                    ? translate('Blocked')
                    : translate('Active')
                  : isFatal
                    ? translate('Block Limit')
                    : translate('Clear')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Strike Warning Details Box */}
      {activeStrikes.length > 0 && !isBlocked && (
        <div className="mt-3 p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 dark:bg-amber-500/5 space-y-3">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wide">
            <AlertTriangle size={15} />
            <span>{translate('Strike Warning Issued')}</span>
          </div>
          <p className="text-xs text-amber-950 font-medium leading-relaxed m-0 dark:text-amber-200">
            {translate(
              'You currently have {{value0}} active strike(s) on your profile. A strike is issued when a venue owner marks a confirmed reservation as an unexcused no-show. Reaching 4 active strikes automatically suspends your account and prevents you from making new court reservations.',
              { value0: String(activeStrikes.length) },
            )}
          </p>

          <div className="pt-1 space-y-2">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              {translate('Active Strike Records')}
            </span>
            <div className="space-y-2">
              {activeStrikes.map((strike, idx) => (
                <div
                  key={strike.id}
                  className="p-3 rounded-lg border border-amber-500/30 bg-white/80 dark:bg-black/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-800 dark:text-amber-300">
                        {translate('Strike {{num}}', { num: String(idx + 1) })}
                      </span>
                      {strike.reservation?.bookingCode && (
                        <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                          {strike.reservation.bookingCode}
                        </span>
                      )}
                      {strike.venue?.name && (
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          • {strike.venue.name}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                      {translate('Expires: {{date}} (6-month term)', {
                        date: new Date(strike.expiresAt).toLocaleDateString(),
                      })}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    {translate('Unexcused No-Show')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isBlocked && (
        <div className="mt-4 bg-slate-50 border border-rose-500/30 rounded-xl p-4 dark:bg-black/40">
          <h3 className="text-sm font-bold text-rose-700 mb-2 dark:text-rose-400">
            {translate('Appeal Suspension')}
          </h3>
          {appealSubmitted ? (
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5 dark:text-emerald-400">
              <CheckCircle2 size={14} />
              {translate(
                'Your appeal has been submitted to super admin. You will be notified once reviewed.',
              )}
            </p>
          ) : (
            <form onSubmit={handleAppeal} className="space-y-3">
              <textarea
                rows={3}
                value={appealMessage}
                onChange={(e) => setAppealMessage(e.target.value)}
                placeholder={translate('Explain why your strikes should be cleared...')}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 dark:bg-[#0b1715] dark:border-white/15 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={isSubmittingAppeal}
                className="button px-4 py-2 rounded-xl text-xs font-extrabold bg-rose-500 hover:bg-rose-400 text-white shadow-md shadow-rose-500/25 transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <Send size={13} />
                <span>
                  {isSubmittingAppeal
                    ? translate('Submitting…')
                    : translate('Submit Appeal to Admin')}
                </span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
