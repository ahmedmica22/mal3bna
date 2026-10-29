import { Upload } from 'lucide-react';
import type { OwnerVenueContentProps } from '../types';

export function OwnerVenuePitchPhotos({
  handleFilesUpload,
  newCourtPhotos,
  setNewCourtPhotos,
  translate,
}: Pick<
  OwnerVenueContentProps,
  'handleFilesUpload' | 'newCourtPhotos' | 'setNewCourtPhotos' | 'translate'
>) {
  return (
    <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-white/5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
          {translate('Pitch Photos (Min 2, Max 6) *')}
        </label>
        <span className="text-[11px] font-bold text-emerald-700 dark:text-lime-400">
          {newCourtPhotos.length}
          {translate('/6 photos selected')}
        </span>
      </div>
      <p className="text-[11px] text-slate-500 dark:text-slate-400">
        {translate(
          'Upload between 2 and 6 photos of this specific pitch directly from your device.',
        )}
      </p>

      {/* Direct Device File Upload */}
      {newCourtPhotos.length < 6 && (
        <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-lime-400/40 hover:border-lime-400 rounded-2xl bg-lime-400/5 hover:bg-lime-400/10 cursor-pointer transition-all">
          <Upload size={22} className="text-emerald-700 mb-1 dark:text-lime-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {translate('Upload pitch photos from your device / phone')}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {translate('Select images (JPG, PNG, WEBP) • Min 2, Max 6 photos')}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void handleFilesUpload(e.target.files, 'court')}
          />
        </label>
      )}

      {/* Preview Thumbs */}
      {newCourtPhotos.length > 0 ? (
        <div className="flex gap-2 pt-1 flex-wrap">
          {newCourtPhotos.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={url}
                alt={translate('Court photo {{value0}}', { value0: idx + 1 })}
                className="w-20 h-14 object-cover rounded-xl border border-slate-200 dark:border-white/10"
              />
              <button
                type="button"
                onClick={() => {
                  setNewCourtPhotos(newCourtPhotos.filter((_, i) => i !== idx));
                }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 hover:bg-rose-400 text-white rounded-full flex items-center justify-center text-[10px] font-bold cursor-pointer shadow-md"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic dark:text-slate-400">
          {translate('No pitch photos uploaded yet. Select at least 2 photos from your device.')}
        </p>
      )}

      <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-800 text-[11px] dark:text-amber-300">
        {translate(
          '🛡️ Note: All new courts require Super Admin review and approval before they can accept bookings.',
        )}
      </div>
    </div>
  );
}
