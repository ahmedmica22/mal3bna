import { photoUrls } from '../../../../utils/photos';

import type { AdminVenuesContentProps } from '../types';

export function AdminVenuesPendingCourtsQueue({
  courtActionLoadingId,
  handleApproveCourt,
  handleRejectCourt,
  pendingCourts,
  pendingCourtsQuery,
  translate,
}: Pick<
  AdminVenuesContentProps,
  | 'courtActionLoadingId'
  | 'handleApproveCourt'
  | 'handleRejectCourt'
  | 'pendingCourts'
  | 'pendingCourtsQuery'
  | 'translate'
>) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
            <span>{translate('🏟️ Pitches Pending Verification')}</span>
          </h2>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              pendingCourts.length > 0
                ? 'bg-amber-400/20 text-amber-800 border border-amber-400/30 dark:text-amber-300'
                : 'bg-slate-50 text-slate-500 border border-slate-200 dark:bg-white/5 dark:text-slate-400 dark:border-white/10'
            }`}
          >
            {pendingCourts.length} {translate('pending')}
          </span>
        </div>
        <button
          type="button"
          onClick={() => void pendingCourtsQuery.refetch()}
          className="text-xs text-emerald-700 hover:text-emerald-700 font-bold cursor-pointer dark:text-lime-400 dark:hover:text-lime-300"
        >
          {translate('Refresh Queue')}
        </button>
      </div>

      {pendingCourts.length === 0 ? (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1 dark:bg-white/5 dark:border-white/10">
          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
            {translate('All court submissions have been reviewed.')}
          </p>
          <p className="text-[11px] text-slate-500">
            {translate(
              'New pitches created by venue owners will appear here for mandatory verification before going public.',
            )}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pendingCourts.map((court) => {
            const courtPhotos = photoUrls(court.photos);
            const isLoading = courtActionLoadingId === court.id;

            return (
              <div
                key={court.id}
                className="p-5 rounded-2xl bg-slate-50 border border-amber-400/30 space-y-3 shadow-lg flex flex-col justify-between dark:bg-black/40"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">
                        {court.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-bold dark:text-slate-400">
                        {court.venue?.name ?? translate('Venue')}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {translate('Owner:')}{' '}
                        {court.venue?.owner?.name ??
                          court.venue?.owner?.email ??
                          translate('Unknown')}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400/15 text-amber-800 border border-amber-400/20 uppercase dark:text-amber-300">
                      {translate('Pending')}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-1 dark:text-slate-300">
                    <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 capitalize font-medium dark:bg-white/5 dark:border-white/10">
                      {translate(court.sport ?? '')}{' '}
                      {court.size ? translate('({{value0}}-a-side)', { value0: court.size }) : ''}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 font-medium dark:bg-white/5 dark:border-white/10">
                      {court.surface ?? translate('Turf')}
                    </span>
                    <span className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 font-medium dark:bg-white/5 dark:border-white/10">
                      {court.isIndoor ? translate('Indoor') : translate('Outdoor')}
                    </span>
                  </div>

                  {/* Court Photos Preview */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold dark:text-slate-400">
                      <span>{translate('Pitch Photos')}</span>
                      <span className="text-emerald-700 dark:text-lime-400">
                        {courtPhotos.length} {translate('uploaded')}
                      </span>
                    </div>
                    {courtPhotos.length > 0 ? (
                      <div className="grid grid-cols-3 gap-1.5">
                        {courtPhotos.slice(0, 3).map((url: string, idx: number) => (
                          <img
                            key={idx}
                            src={url}
                            alt={`${court.name} ${idx + 1}`}
                            className="w-full h-14 object-cover rounded-lg border border-slate-200 dark:border-white/10"
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-[10px] text-rose-700 italic dark:text-rose-400">
                        {translate('No photos uploaded')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-200 flex gap-2 dark:border-white/10">
                  <button
                    type="button"
                    disabled={isLoading || courtPhotos.length < 2}
                    onClick={() => void handleApproveCourt(court)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 transition-all disabled:opacity-50 cursor-pointer shadow-sm text-center"
                  >
                    {isLoading ? '…' : translate('✓ Approve Court')}
                  </button>
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => void handleRejectCourt(court)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-700 border border-rose-500/30 transition-all disabled:opacity-50 cursor-pointer dark:text-rose-300"
                  >
                    {translate('✕ Reject')}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
