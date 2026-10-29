import { Camera, Trash2 } from 'lucide-react';
import type { OwnerProfileContentProps } from '../types';

export function OwnerProfileMatchDetails({
  handlePhotoUpload,
  handleRemovePhoto,
  isUploadingPhoto,
  name,
  photoUrl,
  translate,
  user,
}: Pick<
  OwnerProfileContentProps,
  | 'handlePhotoUpload'
  | 'handleRemovePhoto'
  | 'isUploadingPhoto'
  | 'name'
  | 'photoUrl'
  | 'translate'
  | 'user'
>) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-6 dark:bg-[#13221f]/80 dark:border-white/10">
      <h2 className="text-sm font-black text-emerald-700 uppercase tracking-wider flex items-center gap-2 dark:text-lime-400">
        <Camera size={16} />
        <span>{translate('Profile Photo')}</span>
      </h2>

      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative group">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={user?.name ?? translate('Owner Avatar')}
              className="w-32 h-32 rounded-full object-cover border-4 border-lime-400/80 shadow-2xl shadow-lime-400/20"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-lime-400/20 via-slate-800 to-slate-900 border-4 border-dashed border-slate-200 flex items-center justify-center text-emerald-700 font-black text-4xl shadow-xl dark:border-white/20 dark:text-lime-400">
              {name ? name.charAt(0).toUpperCase() : 'O'}
            </div>
          )}

          {/* Upload Overlay Button */}
          <label
            htmlFor="owner-photo-input"
            className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer"
            title={translate('Click to change photo')}
          >
            <Camera size={24} className="mb-1" />
            <span className="text-[10px] font-bold">{translate('Change Photo')}</span>
          </label>
        </div>

        <input
          id="owner-photo-input"
          type="file"
          accept="image/*"
          className="sr-only"
          disabled={isUploadingPhoto}
          onChange={(e) => void handlePhotoUpload(e)}
        />

        <div className="space-y-2 w-full">
          <label
            htmlFor="owner-photo-input"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-400/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Camera size={14} />
            <span>
              {isUploadingPhoto ? translate('Uploading photo…') : translate('Upload New Photo')}
            </span>
          </label>

          {photoUrl && (
            <button
              type="button"
              onClick={() => void handleRemovePhoto()}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer dark:border-rose-500/20 dark:hover:bg-rose-500/10 dark:text-rose-400"
            >
              <Trash2 size={13} />
              <span>{translate('Remove Photo')}</span>
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-400 leading-tight">
          {translate('Supported: JPG, PNG, WebP up to 5MB. Clear face photo recommended.')}
        </p>
      </div>
    </div>
  );
}
