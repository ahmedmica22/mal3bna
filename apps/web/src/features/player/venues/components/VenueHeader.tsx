import { Badge } from '../../../../components/ui/Badge';
import { MapPin, Phone } from 'lucide-react';
import type { VenueContentProps } from '../types';

export function VenueHeader({
  allVenueCoverPhotos,
  translate,
  venue,
}: Pick<VenueContentProps, 'allVenueCoverPhotos' | 'translate' | 'venue'>) {
  return (
    <div className="venue-hero rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md dark:border-white/10 dark:bg-[#13221f]/90 dark:shadow-2xl flex flex-col md:flex-row gap-6 sm:gap-8 items-start mb-8 overflow-hidden relative">
      {/* Venue Photo / Gallery Preview */}
      {allVenueCoverPhotos.length > 0 ? (
        <div className="relative w-full md:w-56 aspect-video md:aspect-square rounded-2xl overflow-hidden shrink-0 border border-slate-200 shadow-xl bg-slate-900 group dark:border-white/15">
          <img
            src={allVenueCoverPhotos[0]}
            alt={venue.data.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {allVenueCoverPhotos.length > 1 && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/80 text-emerald-700 border border-slate-200 dark:text-lime-400 dark:border-white/15">
              📷 {allVenueCoverPhotos.length} {translate('Photos')}
            </span>
          )}
        </div>
      ) : (
        <div className="detail-photo w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-emerald-800 to-slate-900 border border-slate-200 flex items-center justify-center text-4xl sm:text-5xl font-black text-emerald-700 shrink-0 shadow-lg dark:border-white/10 dark:text-lime-400">
          <span>{venue.data.name.slice(0, 1)}</span>
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge tone="success">
            <span className="inline-block w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#baf35e] animate-pulse me-1.5 align-middle" />{' '}
            {translate('Verified Venue')}
          </Badge>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-300">
            {venue.data.courts?.length ?? 0}{' '}
            {venue.data.courts?.length === 1 ? translate('Pitch') : translate('Pitches')}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-lime-400/10 text-emerald-700 border border-lime-400/25 dark:text-lime-400">
            {translate('24-Hour Operation')}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mb-2">
          {venue.data.name}
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-300 flex items-center gap-1.5 mb-2.5">
          <MapPin size={15} className="text-emerald-600 dark:text-lime-400 shrink-0" />
          <span>{venue.data.address ?? translate('Cairo, Egypt')}</span>
        </p>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mb-4">
          {venue.data.description ??
            translate(
              'Premier sports destination with certified high-grade turf, floodlights, and player amenities.',
            )}
        </p>

        <div className="flex items-center gap-4 flex-wrap text-xs font-semibold text-slate-600 pt-2 border-t border-slate-200 dark:text-slate-300 dark:border-white/10">
          {venue.data.phone && (
            <span className="text-emerald-700 flex items-center gap-1.5 dark:text-lime-400">
              <Phone size={14} /> {translate('Direct contact:')} {venue.data.phone}
            </span>
          )}
          <span className="text-slate-500 dark:text-slate-400">
            {translate('Max booking:')} {venue.data.maxHoursPerBooking ?? 4}{' '}
            {translate('consecutive hours')}
          </span>
        </div>
      </div>
    </div>
  );
}
