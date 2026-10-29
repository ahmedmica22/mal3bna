import { Send } from 'lucide-react';
import type { OwnerVenueContentProps } from '../types';
import { VenueOverviewSection } from '../components/VenueOverviewSection';
import { VenuePhotosSection } from '../components/VenuePhotosSection';
import { CourtPortfolioSection } from '../components/CourtPortfolioSection';
import { EditVenueDialog } from '../components/EditVenueDialog';
import { ManagePhotosDialog } from '../components/ManagePhotosDialog';

export function OwnerVenueContent({
  courtHourlyPrice,
  courtName,
  currentPhotos,
  editAddress,
  editDescription,
  editMaxHours,
  editName,
  editPhone,
  editPhotosList,
  getStatusBadge,
  handleAddCourt,
  handleFilesUpload,
  handleSaveEditVenue,
  handleSavePhotos,
  handleSetPricing,
  handleSubmitForApproval,
  isIndoor,
  isSubmittingCourt,
  isSubmittingEdit,
  isSubmittingPhotos,
  isSubmittingPricing,
  newCourtPhotos,
  priceEgp,
  pricingCourtId,
  removeEditPhoto,
  setCourtHourlyPrice,
  setCourtName,
  setEditAddress,
  setEditDescription,
  setEditMaxHours,
  setEditName,
  setEditPhone,
  setEditPhotosList,
  setIsIndoor,
  setNewCourtPhotos,
  setPriceEgp,
  setPricingCourtId,
  setShowAddCourt,
  setShowEditVenueModal,
  setShowManagePhotosModal,
  setSize,
  setSport,
  setSurface,
  showAddCourt,
  showEditVenueModal,
  showManagePhotosModal,
  size,
  sport,
  surface,
  translate,
  venue,
}: OwnerVenueContentProps) {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="eyebrow text-xs font-black text-emerald-700 uppercase tracking-wider mb-1 dark:text-lime-400">
            {translate('OWNER SPACE • VENUE CONFIGURATION')}
          </p>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight dark:text-slate-100">
              {venue.name}
            </h1>
            <span
              className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase border tracking-wider ${getStatusBadge(
                venue.status ?? 'draft',
              )}`}
            >
              {venue.status ?? translate('draft')}
            </span>
          </div>
        </div>

        {venue.status === 'draft' && (
          <button
            type="button"
            className="button px-4 py-2.5 rounded-full text-xs font-extrabold bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-md shadow-lime-400/20 transition-all cursor-pointer inline-flex items-center gap-1.5"
            onClick={() => void handleSubmitForApproval()}
          >
            <Send size={14} />
            <span>{translate('Submit for Admin Approval')}</span>
          </button>
        )}
      </div>

      {/* Venue Overview Details */}
      <VenueOverviewSection
        {...{
          setEditAddress,
          setEditDescription,
          setEditMaxHours,
          setEditName,
          setEditPhone,
          setShowEditVenueModal,
          translate,
          venue,
        }}
      />

      {/* Venue Photos Gallery (Min 2, Max 3) */}
      <VenuePhotosSection
        {...{ currentPhotos, setEditPhotosList, setShowManagePhotosModal, translate }}
      />

      {/* Courts / Pitches Portfolio */}
      <CourtPortfolioSection
        {...{
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
        }}
      />

      {/* Edit Venue Details Modal */}
      {
        <EditVenueDialog
          {...{
            editAddress,
            editDescription,
            editMaxHours,
            editName,
            editPhone,
            handleSaveEditVenue,
            isSubmittingEdit,
            setEditAddress,
            setEditDescription,
            setEditMaxHours,
            setEditName,
            setEditPhone,
            setShowEditVenueModal,
            showEditVenueModal,
            translate,
          }}
        />
      }

      {/* Manage Photos Modal (Min 2, Max 3) */}
      {
        <ManagePhotosDialog
          {...{
            editPhotosList,
            handleFilesUpload,
            handleSavePhotos,
            isSubmittingPhotos,
            removeEditPhoto,
            setShowManagePhotosModal,
            showManagePhotosModal,
            translate,
          }}
        />
      }
    </div>
  );
}
