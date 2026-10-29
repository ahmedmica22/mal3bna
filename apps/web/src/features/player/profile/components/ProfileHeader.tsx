import { User, Camera } from 'lucide-react';
import type { ProfileContentProps } from '../types';

export function ProfileHeader({
  handlePhotoUpload,
  isUploadingPhoto,
  photoUrl,
  translate,
  user,
}: Pick<
  ProfileContentProps,
  'handlePhotoUpload' | 'isUploadingPhoto' | 'photoUrl' | 'translate' | 'user'
>) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2">
      <div className="flex items-center gap-5">
        {/* Avatar display + upload */}
        <div className="relative group">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={user?.name ?? translate('Player Avatar')}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-lime-400/80 shadow-xl shadow-lime-400/10"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-lime-400/20 via-slate-800 to-slate-900 border-2 border-dashed border-slate-200 flex items-center justify-center text-emerald-700 font-black text-2xl shadow-xl dark:border-white/20 dark:text-lime-400">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : <User size={32} />}
            </div>
          )}
          <label
            className="absolute -bottom-1 -right-1 p-2 rounded-full bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-lg cursor-pointer transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
            title={translate('Upload profile photo')}
          >
            <Camera size={14} className={isUploadingPhoto ? 'animate-pulse' : ''} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploadingPhoto}
              onChange={(e) => void handlePhotoUpload(e)}
            />
          </label>
        </div>

        <div>
          <p className="eyebrow text-xs font-black text-emerald-700 uppercase tracking-wider mb-1 dark:text-lime-400">
            {translate('PLAYER • PROFILE & TRUST')}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
            {user?.name ?? translate('Player Profile')}
          </h1>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 dark:text-slate-400">
            <span>{user?.email ?? ''}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold dark:text-lime-400">
              {photoUrl ? translate('Custom Avatar Saved') : translate('Default Avatar')}
            </span>
          </p>
        </div>
      </div>

      <div>
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all shadow-sm dark:bg-white/10 dark:hover:bg-white/15 dark:text-slate-200 dark:border-white/15">
          <Camera size={14} className="text-emerald-700 dark:text-lime-400" />
          <span>
            {isUploadingPhoto ? translate('Uploading Photo…') : translate('Upload Profile Photo')}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploadingPhoto}
            onChange={(e) => void handlePhotoUpload(e)}
          />
        </label>
      </div>
    </div>
  );
}
