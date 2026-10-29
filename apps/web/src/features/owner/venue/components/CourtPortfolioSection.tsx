import { Plus, Layers } from 'lucide-react';
import type { OwnerVenueContentProps } from '../types';
import { AddCourtForm } from './AddCourtForm';
import { OwnerVenueCourtsGrid } from './OwnerVenueCourtsGrid';

export function CourtPortfolioSection({
  courtHourlyPrice,
  courtName,
  handleAddCourt,
  handleFilesUpload,
  handleSetPricing,
  isIndoor,
  isSubmittingCourt,
  isSubmittingPricing,
  newCourtPhotos,
  priceEgp,
  pricingCourtId,
  setCourtHourlyPrice,
  setCourtName,
  setIsIndoor,
  setNewCourtPhotos,
  setPriceEgp,
  setPricingCourtId,
  setShowAddCourt,
  setSize,
  setSport,
  setSurface,
  showAddCourt,
  size,
  sport,
  surface,
  translate,
  venue,
}: Pick<
  OwnerVenueContentProps,
  | 'courtHourlyPrice'
  | 'courtName'
  | 'handleAddCourt'
  | 'handleFilesUpload'
  | 'handleSetPricing'
  | 'isIndoor'
  | 'isSubmittingCourt'
  | 'isSubmittingPricing'
  | 'newCourtPhotos'
  | 'priceEgp'
  | 'pricingCourtId'
  | 'setCourtHourlyPrice'
  | 'setCourtName'
  | 'setIsIndoor'
  | 'setNewCourtPhotos'
  | 'setPriceEgp'
  | 'setPricingCourtId'
  | 'setShowAddCourt'
  | 'setSize'
  | 'setSport'
  | 'setSurface'
  | 'showAddCourt'
  | 'size'
  | 'sport'
  | 'surface'
  | 'translate'
  | 'venue'
>) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl backdrop-blur-md space-y-4 dark:bg-[#13221f]/80 dark:border-white/10">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 dark:text-slate-100">
            <Layers size={18} className="text-emerald-700 dark:text-lime-400" />
            <span>
              {translate('Pitch Portfolio (')}
              {venue.courts?.length ?? 0})
            </span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {translate(
              'Fixed 60-minute match slots in 24 hours schedule. Players can book up to 4 consecutive slots.',
            )}
          </p>
        </div>
        <button
          type="button"
          className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-lime-400 hover:bg-lime-300 text-slate-950 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
          onClick={() => {
            setNewCourtPhotos([]);
            setShowAddCourt(true);
          }}
        >
          <Plus size={14} />
          <span>{translate('Add Pitch')}</span>
        </button>
      </div>

      {/* Add Court Modal / Expandable Form */}
      {
        <AddCourtForm
          {...{
            courtHourlyPrice,
            courtName,
            handleAddCourt,
            handleFilesUpload,
            isIndoor,
            isSubmittingCourt,
            newCourtPhotos,
            setCourtHourlyPrice,
            setCourtName,
            setIsIndoor,
            setNewCourtPhotos,
            setShowAddCourt,
            setSize,
            setSport,
            setSurface,
            showAddCourt,
            size,
            sport,
            surface,
            translate,
          }}
        />
      }

      {/* Courts Grid */}
      <OwnerVenueCourtsGrid
        {...{
          handleSetPricing,
          isSubmittingPricing,
          priceEgp,
          pricingCourtId,
          setPriceEgp,
          setPricingCourtId,
          translate,
          venue,
        }}
      />
    </div>
  );
}
