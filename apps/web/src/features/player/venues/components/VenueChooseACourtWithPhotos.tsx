import type { VenueContentProps } from '../types';
import { VenueSelectedCourtPitchPhotosShowcase } from './VenueSelectedCourtPitchPhotosShowcase';

export function VenueChooseACourtWithPhotos({
  activeCourtPhotoIdx,
  courtId,
  getCourtPhoto,
  getCourtPhotos,
  selectedCourt,
  selectedCourtPhotos,
  setActiveCourtPhotoIdx,
  setCourtId,
  setSelected,
  translate,
  venue,
}: Pick<
  VenueContentProps,
  | 'activeCourtPhotoIdx'
  | 'courtId'
  | 'getCourtPhoto'
  | 'getCourtPhotos'
  | 'selectedCourt'
  | 'selectedCourtPhotos'
  | 'setActiveCourtPhotoIdx'
  | 'setCourtId'
  | 'setSelected'
  | 'translate'
  | 'venue'
>) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <p className="eyebrow text-xs font-black text-emerald-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            {translate('01 · CHOOSE A COURT / PITCH')}
          </p>
          <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
            {translate('Select Available Pitch')}
          </h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {venue.data.courts?.length ?? 0} {translate('approved pitches ready for booking')}
        </span>
      </div>

      <div className="court-tabs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(venue.data.courts ?? []).map((court) => {
          const isSelected = court.id === courtId;
          const photoUrl = getCourtPhoto(court);
          const photosCount = getCourtPhotos(court).length;
          return (
            <button
              type="button"
              key={court.id}
              onClick={() => {
                setCourtId(court.id);
                setSelected([]);
                setActiveCourtPhotoIdx(0);
              }}
              className={`court-tab rounded-2xl overflow-hidden text-start border transition-all cursor-pointer flex flex-col ${
                isSelected
                  ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/40 shadow-xl shadow-emerald-500/10 scale-[1.01] dark:bg-lime-400/10 dark:border-lime-400 dark:ring-lime-400/50 dark:shadow-lime-400/10'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-emerald-500/40 shadow-xs dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 dark:text-slate-200'
              }`}
            >
              {/* Court Thumbnail Image */}
              <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                {photoUrl ? (
                  <img src={photoUrl} alt={court.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-950 to-slate-900 flex items-center justify-center text-slate-500">
                    <span className="text-3xl">🏟️</span>
                  </div>
                )}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-black/80 text-white backdrop-blur-xs">
                  {court.sport === 'padel'
                    ? translate('🎾 Padel')
                    : translate('⚽ {{value0}}-a-side', { value0: court.size || 5 })}
                </span>
                {photosCount > 0 && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-emerald-700 flex items-center gap-1 dark:text-lime-400">
                    📷 {photosCount} {translate('photo')}
                    {photosCount > 1 ? translate('s') : ''}
                  </span>
                )}
                {isSelected && (
                  <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white dark:bg-lime-400 dark:text-slate-950 flex items-center gap-1 shadow-md">
                    {translate('✓ Selected Pitch')}
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <strong
                    className={`block text-base font-black mb-1 ${isSelected ? 'text-emerald-800 dark:text-lime-300' : 'text-slate-900 dark:text-slate-100'}`}
                  >
                    {court.name}
                  </strong>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span>{court.surface ?? translate('Artificial Turf')}</span>
                    <span>•</span>
                    <span>
                      {court.isIndoor ? translate('Covered Indoor') : translate('Outdoor Pitch')}
                    </span>
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {translate('Standard Rate')}
                  </span>
                  <strong className="text-xs font-black text-emerald-700 dark:text-lime-400">
                    {court.priceRules && court.priceRules[0]
                      ? translate('{{value0}} EGP / hr', {
                          value0: (court.priceRules[0].pricePiastres / 100).toFixed(0),
                        })
                      : court.price
                        ? translate('{{value0}} EGP / hr', { value0: court.price })
                        : translate('500 EGP / hr')}
                  </strong>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Court Pitch Photos Showcase */}
      {
        <VenueSelectedCourtPitchPhotosShowcase
          {...{
            activeCourtPhotoIdx,
            selectedCourt,
            selectedCourtPhotos,
            setActiveCourtPhotoIdx,
            translate,
          }}
        />
      }
    </div>
  );
}
