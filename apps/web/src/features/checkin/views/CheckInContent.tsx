import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, User, AlertCircle, Phone, CreditCard } from 'lucide-react';
import type { CheckInContentProps } from '../types';

export function CheckInContent({
  loading,
  error,
  data,
  formattedTime,
  translate,
}: CheckInContentProps) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/95 dark:bg-[#0c1816]/95 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center">
        {loading ? (
          <div className="py-8 space-y-5" role="status" aria-live="polite">
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-lime-400/20 border border-lime-400/40 flex items-center justify-center">
                <span className="w-4 h-4 rounded-full bg-lime-400 animate-ping" />
              </div>
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                {translate('Verifying QR Code & Checking In...')}
              </h2>
              <p className="text-xs text-slate-400">
                {translate('Connecting to Mal3bna pitch match-day operations.')}
              </p>
            </div>
            <div className="space-y-3 pt-3 max-w-xs mx-auto">
              <div className="h-4 rounded-md shimmer-wave" />
              <div className="h-4 w-3/4 mx-auto rounded-md shimmer-wave" />
              <div className="h-10 rounded-xl shimmer-wave mt-4" />
            </div>
          </div>
        ) : error ? (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {translate('Check-In Not Completed')}
            </h2>
            <p className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
              {error}
            </p>
            <div className="pt-4">
              <Link
                to="/"
                className="inline-block px-6 py-2.5 rounded-full text-xs font-black bg-lime-400 hover:bg-lime-300 text-slate-950 transition-all shadow-md shadow-lime-400/20"
              >
                {translate('Return to Home')}
              </Link>
            </div>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="w-20 h-20 bg-lime-400/15 border-2 border-lime-400/40 rounded-full flex items-center justify-center mx-auto text-lime-400 shadow-xl shadow-lime-400/20">
              <CheckCircle2 size={44} className="stroke-[2.5]" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-lime-400/20 text-emerald-800 dark:text-lime-300 border border-lime-400/30 mb-2">
                {translate('✓ PLAYER CHECKED IN (ARRIVED)')}
              </span>
              <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                #{data.bookingCode}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {data.alreadyArrived
                  ? translate('Player was already checked in. Match status is ready for kickoff.')
                  : translate('Kickoff attendance logged in real-time on Mal3bna.')}
              </p>
            </div>

            {/* Match & Player Details Card */}
            <div className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-start space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-lime-400/15 flex items-center justify-center text-lime-400 shrink-0">
                  <User size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {translate('Player Name')}
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                    {data.customerName || translate('Guest Player')}
                  </p>
                </div>
              </div>

              {data.customerPhone && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      {translate('Phone Number')}
                    </p>
                    <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                      {data.customerPhone}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/15 flex items-center justify-center text-cyan-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {translate('Venue & Pitch')}
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100 truncate">
                    {data.venueName} • {data.courtName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
                  <Clock size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    {translate('Kickoff Time')}
                  </p>
                  <p className="text-sm font-black text-slate-900 dark:text-slate-100">
                    {formattedTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 shrink-0">
                  <CreditCard size={18} />
                </div>
                <div className="min-w-0 flex-1 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      {translate('Cash Due At Court')}
                    </p>
                    <p className="text-sm font-black text-emerald-700 dark:text-lime-400">
                      {data.dueAtVenuePiastres > 0
                        ? `EGP ${data.dueAtVenuePiastres / 100}`
                        : translate('100% Paid Online')}
                    </p>
                  </div>
                  {data.dueAtVenuePiastres > 0 && (
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                      {translate('Collect at Kickoff')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/owner/bookings"
                className="flex-1 py-3 rounded-2xl text-xs font-black bg-lime-400 hover:bg-lime-300 text-slate-950 transition-all text-center shadow-lg shadow-lime-400/20"
              >
                {translate('Go to Owner Match Day')}
              </Link>
              <Link
                to="/"
                className="flex-1 py-3 rounded-2xl text-xs font-black bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 text-slate-900 dark:text-slate-100 transition-all text-center"
              >
                {translate('Back to Home')}
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
