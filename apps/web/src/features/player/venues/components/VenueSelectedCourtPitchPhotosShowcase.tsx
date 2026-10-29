import { Camera } from 'lucide-react';
import type { VenueContentProps } from '../types';

export function VenueSelectedCourtPitchPhotosShowcase({
  activeCourtPhotoIdx,
  selectedCourt,
  selectedCourtPhotos,
  setActiveCourtPhotoIdx,
  translate,
}: Pick<
  VenueContentProps,
  | 'activeCourtPhotoIdx'
  | 'selectedCourt'
  | 'selectedCourtPhotos'
  | 'setActiveCourtPhotoIdx'
  | 'translate'
>) {
  return (
    <>
      {selectedCourt && selectedCourtPhotos.length > 0 && (
        <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 shadow-sm dark:bg-black/40 dark:border-white/10 dark:text-slate-200 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Camera size={16} className="text-emerald-600 dark:text-lime-400" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-200">
                {selectedCourt.name} {translate('• Pitch Photos (')}
                {selectedCourtPhotos.length})
              </h4>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {translate('Verified photos of turf quality, lighting, and court condition')}
            </span>
          </div>

          {/* Main Active Photo Preview */}
          <div className="relative aspect-video max-h-80 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/15 bg-black">
            <img
              src={selectedCourtPhotos[activeCourtPhotoIdx] || selectedCourtPhotos[0]}
              alt={translate('{{value0}} photo {{value1}}', {
                value0: selectedCourt.name,
                value1: activeCourtPhotoIdx + 1,
              })}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-black/80 text-white backdrop-blur-md">
              {translate('Photo')} {activeCourtPhotoIdx + 1} {translate('of')}{' '}
              {selectedCourtPhotos.length}
            </span>
          </div>

          {/* Thumbnails row */}
          {selectedCourtPhotos.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
              {selectedCourtPhotos.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveCourtPhotoIdx(idx)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    activeCourtPhotoIdx === idx
                      ? 'border-lime-400 ring-2 ring-lime-400/40 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-200 dark:border-white/10 dark:hover:border-white/30'
                  }`}
                >
                  <img
                    src={url}
                    alt={translate('Thumbnail {{value0}}', { value0: idx + 1 })}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
