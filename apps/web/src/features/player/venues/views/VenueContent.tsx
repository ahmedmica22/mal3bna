import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import type { VenueContentProps } from '../types';
import { VenueHeader } from '../components/VenueHeader';
import { VenueBookingBuilder } from '../components/VenueBookingBuilder';

export function VenueContent({
  activeCourtPhotoIdx,
  allVenueCoverPhotos,
  availability,
  courtId,
  getCourtPhoto,
  getCourtPhotos,
  navigate,
  selected,
  selectedCourt,
  selectedCourtPhotos,
  selectedDate,
  setActiveCourtPhotoIdx,
  setCourtId,
  setSelected,
  setSelectedDate,
  translate,
  venue,
}: VenueContentProps) {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-8">
      <Link
        to="/"
        className="back-link inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 mb-6 transition-colors dark:text-slate-400 dark:hover:text-lime-400"
      >
        <ArrowLeft size={14} /> {translate('Back to courts')}
      </Link>

      {/* Venue Hero Banner with Photos */}
      <VenueHeader {...{ allVenueCoverPhotos, translate, venue }} />

      {/* Booking Builder: Court Selection, Photos, Date & Slots */}
      <VenueBookingBuilder
        {...{
          activeCourtPhotoIdx,
          availability,
          courtId,
          getCourtPhoto,
          getCourtPhotos,
          navigate,
          selected,
          selectedCourt,
          selectedCourtPhotos,
          selectedDate,
          setActiveCourtPhotoIdx,
          setCourtId,
          setSelected,
          setSelectedDate,
          translate,
          venue,
        }}
      />

      {/* Reviews Section */}
      {venue.data.reviews && venue.data.reviews.length > 0 && (
        <section className="mt-12 rounded-3xl border border-slate-200 bg-white/95 p-8 shadow-md dark:border-white/10 dark:bg-[#13221f]/40 dark:shadow-none">
          <p className="eyebrow text-xs font-black text-emerald-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            {translate('PLAYER REVIEWS')}
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            {translate('What players say')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venue.data.reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between gap-3 dark:bg-black/30 dark:border-white/10"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex text-amber-800 text-sm dark:text-amber-400">
                      {'★'.repeat(rev.rating)}
                      {'☆'.repeat(5 - rev.rating)}
                    </div>
                    <small className="text-xs text-slate-500 font-semibold">
                      {translate('Verified match')}
                    </small>
                  </div>
                  <p className="text-sm text-slate-600 m-0 leading-relaxed dark:text-slate-300">
                    {rev.comment ?? rev.text}
                  </p>
                </div>
                {rev.ownerReply && (
                  <div className="bg-slate-50 border-s-2 border-lime-400 p-3 rounded-e-xl text-xs text-slate-600 dark:bg-white/5 dark:text-slate-300">
                    <strong className="text-emerald-700 block mb-1 dark:text-lime-400">
                      {translate('Venue Response:')}
                    </strong>
                    <span>{rev.ownerReply}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
