import { SlotPicker } from '../../../bookings/SlotPicker';
import { DatePicker } from '../../../../components/ui/DatePicker';
import { venueDate } from '../../../../utils/venue-time';
import type { VenueContentProps } from '../types';
import { VenueChooseACourtWithPhotos } from './VenueChooseACourtWithPhotos';

export function VenueBookingBuilder({
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
}: Pick<
  VenueContentProps,
  | 'activeCourtPhotoIdx'
  | 'availability'
  | 'courtId'
  | 'getCourtPhoto'
  | 'getCourtPhotos'
  | 'navigate'
  | 'selected'
  | 'selectedCourt'
  | 'selectedCourtPhotos'
  | 'selectedDate'
  | 'setActiveCourtPhotoIdx'
  | 'setCourtId'
  | 'setSelected'
  | 'setSelectedDate'
  | 'translate'
  | 'venue'
>) {
  return (
    <section className="booking-builder rounded-3xl border border-slate-200 bg-white/95 p-6 sm:p-8 backdrop-blur-md shadow-xl dark:border-white/10 dark:bg-[#13221f]/50 dark:shadow-none space-y-8">
      {/* 01 · CHOOSE A COURT WITH PHOTOS */}
      <VenueChooseACourtWithPhotos
        {...{
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
        }}
      />

      {/* 02 · SELECT DATE */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-t border-slate-200 dark:border-white/10 pt-6 relative z-20">
        <div>
          <p className="eyebrow text-xs font-black text-emerald-700 dark:text-lime-400 tracking-wider uppercase mb-1">
            {translate('02 · SELECT MATCH DAY')}
          </p>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 m-0">
            {translate('Pick Date (Up to 30 Days Ahead)')}
          </h3>
        </div>
        <div className="w-full sm:w-72">
          <DatePicker
            value={selectedDate}
            min={venueDate(new Date())}
            onChange={(newDate) => {
              setSelectedDate(newDate);
              setSelected([]);
            }}
            align="right"
          />
        </div>
      </div>

      {/* 03 · AVAILABLE SLOTS PICKER */}
      {courtId && (
        <SlotPicker
          key={`${courtId}-${selectedDate}`}
          slots={availability.data ?? []}
          onSelect={setSelected}
          maxHours={venue.data.maxHoursPerBooking ?? 4}
          onProceed={() => {
            if (selected.length > 0 && selectedCourt) {
              navigate(
                `/checkout/new?venueId=${venue.data.id}&courtId=${courtId}&startsAt=${encodeURIComponent(
                  selected[0]?.startsAt ?? '',
                )}&hours=${selected.length}&venueName=${encodeURIComponent(
                  venue.data.name,
                )}&courtName=${encodeURIComponent(selectedCourt.name)}`,
              );
            }
          }}
        />
      )}
    </section>
  );
}
