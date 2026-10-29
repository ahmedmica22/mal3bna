import { Camera } from 'lucide-react';
import type { OwnerVenueContentProps } from '../types';

export function VenuePhotosSection({
  currentPhotos,
  setEditPhotosList,
  setShowManagePhotosModal,
  translate,
}: Pick<
  OwnerVenueContentProps,
  'currentPhotos' | 'setEditPhotosList' | 'setShowManagePhotosModal' | 'translate'
>) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4 dark:bg-[#13221f]/80 dark:border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
            <Camera size={18} className="text-emerald-700 dark:text-lime-400" />
            <span>
              {translate('Venue Photos (')}
              {currentPhotos.length}/6)
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {translate('Platform rules require minimum 2 and maximum 6 verified photos.')}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditPhotosList(currentPhotos);
            setShowManagePhotosModal(true);
          }}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm dark:bg-white/10 dark:hover:bg-white/20 dark:text-slate-200 dark:border-white/15"
        >
          <Camera size={13} className="text-emerald-700 dark:text-lime-400" />
          <span>{translate('Manage Photos (Min 2, Max 6)')}</span>
        </button>
      </div>

      {currentPhotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {currentPhotos.map((url: string, idx: number) => (
            <div
              key={idx}
              className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15"
            >
              <img
                src={url}
                alt={translate('Venue Photo {{value0}}', { value0: idx + 1 })}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                {translate('Photo')} {idx + 1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center dark:bg-white/5 dark:border-white/10">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {translate('No photos uploaded yet. Tap "Manage Photos" to upload 2 to 6 photos.')}
          </p>
        </div>
      )}
    </div>
  );
}
