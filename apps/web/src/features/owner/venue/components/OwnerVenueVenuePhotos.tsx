import { Camera, Upload } from 'lucide-react';
import type { OwnerVenueOnboardingProps } from '../types';

export function OwnerVenueVenuePhotos({
  handleFilesUpload,
  removeOnboardingPhoto,
  translate,
  venuePhotos,
}: Pick<
  OwnerVenueOnboardingProps,
  'handleFilesUpload' | 'removeOnboardingPhoto' | 'translate' | 'venuePhotos'
>) {
  return (
    <div className="border-t border-b border-slate-200 py-5 space-y-4 dark:border-white/10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
            <Camera size={18} className="text-emerald-700 dark:text-lime-400" />
            <span>{translate('2. Venue Photos (Min 2, Max 6) *')}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 dark:text-slate-400">
            {translate(
              'Platform requirement: upload between 2 and 6 photos showing your pitch, surface, and amenities.',
            )}
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-black bg-lime-400/20 text-emerald-700 border border-lime-400/30 dark:text-lime-300">
          {venuePhotos.length}
          {translate('/6 Photos')}
        </span>
      </div>

      {/* Direct Device File Upload */}
      {venuePhotos.length < 6 && (
        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-lime-400/40 hover:border-lime-400 rounded-2xl bg-lime-400/5 hover:bg-lime-400/10 cursor-pointer transition-all">
          <Upload size={24} className="text-emerald-700 mb-1.5 dark:text-lime-400" />
          <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
            {translate('Click to choose photos from your device / phone')}
          </span>
          <span className="text-[11px] text-slate-500 mt-0.5 dark:text-slate-400">
            {translate('Select image files (JPG, PNG, WEBP) • Min 2, Max 6 photos')}
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => void handleFilesUpload(e.target.files, 'onboarding')}
          />
        </label>
      )}

      {/* Photo Previews */}
      {venuePhotos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {venuePhotos.map((url, idx) => (
            <div
              key={idx}
              className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 group dark:border-white/15"
            >
              <img
                src={url}
                alt={translate('Venue Photo {{value0}}', { value0: idx + 1 })}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                {translate('Photo')} {idx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeOnboardingPhoto(idx)}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500/90 text-white flex items-center justify-center text-xs font-bold hover:bg-rose-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500 italic dark:text-slate-400">
          {translate('No photos uploaded yet. Select at least 2 photos from your device.')}
        </p>
      )}
    </div>
  );
}
