import { useLanguage } from '../../store/LanguageStore';
import { useMemo } from 'react';
import { MapPin, ArrowUpRight, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Venue } from '../../types/domain';
import { Badge } from '../../components/ui/Badge';

export function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const { translate, language } = useLanguage();
  const sports = Array.from(new Set((venue.courts ?? []).map((c) => c.sport)));

  // Extract cover photo: venue photo first, or first court photo
  const { coverPhoto, totalPhotos } = useMemo(() => {
    const venuePhotos = (venue.photos ?? [])
      .map((p) => p.file?.storageKey ?? p.storageKey)
      .filter((url): url is string => Boolean(url));

    const courtPhotos = (venue.courts ?? []).flatMap((c) =>
      (c.photos ?? [])
        .map((p) => p.file?.storageKey ?? p.storageKey)
        .filter((url): url is string => Boolean(url)),
    );

    const all = [...venuePhotos, ...courtPhotos];
    return {
      coverPhoto: all[0] ?? null,
      totalPhotos: all.length,
    };
  }, [venue]);

  return (
    <Link
      to={`/venues/${venue.id}`}
      className="venue-card group relative overflow-hidden rounded-3xl border border-slate-200 bg-white hover:border-emerald-500/40 hover:-translate-y-1.5 transition-all duration-300 shadow-md hover:shadow-xl dark:border-white/10 dark:bg-[#13221f]/75 dark:hover:border-lime-400/40 flex flex-col cursor-pointer no-underline"
    >
      {/* Photo / Header Banner */}
      <div className="venue-photo relative h-48 w-full bg-slate-900 overflow-hidden flex flex-col justify-between p-5">
        {coverPhoto ? (
          <>
            <img
              src={coverPhoto}
              alt={venue.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/40 pointer-events-none" />
          </>
        ) : (
          <div
            className={`absolute inset-0 photo-${index % 3} bg-gradient-to-br from-emerald-950/90 via-[#102a2b] to-[#081513]`}
          >
            {/* Big stylized sport letter in background */}
            <div className="absolute -bottom-4 -end-2 text-7xl font-black text-white/[0.06] select-none pointer-events-none">
              {venue.name.slice(0, 1)}
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 z-10 relative">
          <Badge tone="success">
            <span className="inline-block w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#baf35e] animate-pulse me-1.5 align-middle" />{' '}
            {translate('Verified')}
          </Badge>
          <div className="flex items-center gap-1.5 flex-wrap">
            {sports.map((s) => (
              <span
                key={s}
                className="bg-black/65 backdrop-blur-md text-slate-100 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-white/15"
              >
                {s === 'padel' ? translate('🎾 Padel') : translate('⚽ Football')}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Metadata on Photo */}
        <div className="flex items-center justify-between z-10 relative">
          <span className="photo-mark text-xs font-mono font-bold text-lime-400/90 tracking-widest drop-shadow-md">
            #{String(index + 1).padStart(2, '0')}
          </span>
          {totalPhotos > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-black/70 backdrop-blur-md text-white border border-white/15">
              <Camera size={11} className="text-lime-400" />
              {totalPhotos} {translate('photo')}
              {totalPhotos > 1 ? translate('s') : ''}
            </span>
          )}
        </div>
      </div>

      {/* Body Details */}
      <div className="venue-card-body p-6 flex flex-col justify-between flex-1 gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 dark:text-slate-100 dark:group-hover:text-lime-300 transition-colors line-clamp-1 mb-1">
            {venue.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 m-0">
            <MapPin size={13} className="text-emerald-600 dark:text-lime-400 shrink-0" />
            <span className="truncate">
              {venue.area
                ? `${language === 'ar' ? venue.area.nameAr : venue.area.nameEn}${venue.address ? ` • ${venue.address}` : ''}`
                : (venue.address ?? translate('Cairo'))}
            </span>
            <span>·</span>
            <span className="shrink-0">
              {venue.courts?.length ?? 0}{' '}
              {venue.courts?.length === 1 ? translate('court') : translate('courts')}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {translate('Instant Hold:')}{' '}
            <strong className="text-emerald-600 dark:text-lime-400">{translate('10 min')}</strong>
          </span>
          <span
            aria-label={translate('View {{value0}}', { value0: venue.name })}
            className="button button-small inline-flex items-center gap-1 px-4 py-1.5 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white dark:bg-lime-400/15 dark:text-lime-300 dark:border-lime-400/30 dark:group-hover:bg-lime-400 dark:group-hover:text-slate-950 transition-all shadow-xs"
          >
            <span>{translate('Book')}</span>
            <ArrowUpRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
