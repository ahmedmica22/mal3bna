import { VenueDetailModal } from '../../../components/discovery/VenueDetailModal';
import { CheckoutModal } from '../../../components/checkout/CheckoutModal';
import { CancelBookingModal } from '../../../components/player/CancelBookingModal';
import type { MobileAppViewProps } from '../types';

export type PlayerBookingModalsProps = Pick<
  MobileAppViewProps,
  | 'selectedVenue'
  | 'selectedCourt'
  | 'setSelectedCourt'
  | 'setSelectedVenue'
  | 'setCheckoutDetails'
  | 'token'
  | 'userRole'
  | 'setBrowseAsGuest'
  | 'setCheckoutAfterLogin'
  | 'setConfirmedBookingCode'
  | 'setHoldSeconds'
  | 'isCheckoutOpen'
  | 'setIsCheckoutOpen'
  | 'confirmedBookingCode'
  | 'pendingBooking'
  | 'paymentError'
  | 'checkoutDetails'
  | 'paymentOption'
  | 'setPaymentOption'
  | 'holdSeconds'
  | 'isBookingSubmitting'
  | 'handleCompleteBooking'
  | 'setPlayerTab'
  | 'loadPlayerBookings'
  | 'cancelModalBooking'
  | 'cancelPreview'
  | 'cancelError'
  | 'handleConfirmCancel'
  | 'setCancelModalBooking'
>;

export function PlayerBookingModals({
  selectedVenue,
  selectedCourt,
  setSelectedCourt,
  setSelectedVenue,
  setCheckoutDetails,
  token,
  userRole,
  setBrowseAsGuest,
  setCheckoutAfterLogin,
  setConfirmedBookingCode,
  setHoldSeconds,
  isCheckoutOpen,
  setIsCheckoutOpen,
  confirmedBookingCode,
  pendingBooking,
  paymentError,
  checkoutDetails,
  paymentOption,
  setPaymentOption,
  holdSeconds,
  isBookingSubmitting,
  handleCompleteBooking,
  setPlayerTab,
  loadPlayerBookings,
  cancelModalBooking,
  cancelPreview,
  cancelError,
  handleConfirmCancel,
  setCancelModalBooking,
}: PlayerBookingModalsProps) {
  return (
    <>
      {/* 1. Venue Detail Modal */}
      <VenueDetailModal
        venue={selectedVenue}
        selectedCourt={selectedCourt}
        onSelectCourt={setSelectedCourt}
        onProceedToCheckout={(details) => {
          setCheckoutDetails({
            venue: selectedVenue,
            court: details.court,
            startsAt: details.startsAt,
            hours: details.hours,
            totalPiastres: details.totalPiastres,
            depositPiastres: details.depositPiastres,
            dueAtVenuePiastres: details.dueAtVenuePiastres,
            runs: details.runs,
            selectedSlots: details.selectedSlots,
          });
          setSelectedVenue(null);
          if (token && userRole === 'player') {
            setIsCheckoutOpen(true);
          } else {
            setBrowseAsGuest(false);
            setCheckoutAfterLogin(true);
          }
          setConfirmedBookingCode(null);
          setHoldSeconds(600);
        }}
        onClose={() => setSelectedVenue(null)}
      />

      {/* 2. Checkout & Payment Modal */}
      <CheckoutModal
        visible={isCheckoutOpen}
        confirmedCode={confirmedBookingCode}
        pendingBooking={Boolean(pendingBooking)}
        paymentError={paymentError}
        venue={checkoutDetails?.venue ?? selectedVenue}
        court={checkoutDetails?.court ?? selectedCourt}
        startsAt={checkoutDetails?.startsAt ?? ''}
        hours={checkoutDetails?.hours ?? 1}
        runs={checkoutDetails?.runs}
        selectedSlots={checkoutDetails?.selectedSlots}
        totalPiastres={pendingBooking?.totalPiastres ?? checkoutDetails?.totalPiastres ?? 0}
        depositPiastres={
          pendingBooking?.depositPiastres ?? checkoutDetails?.depositPiastres ?? 0
        }
        dueAtVenuePiastres={checkoutDetails?.dueAtVenuePiastres ?? 0}
        paymentOption={paymentOption}
        onSelectPaymentOption={setPaymentOption}
        holdSeconds={holdSeconds}
        isSubmitting={isBookingSubmitting}
        onSubmit={handleCompleteBooking}
        onSuccessDone={() => {
          setIsCheckoutOpen(false);
          setPlayerTab('bookings');
          void loadPlayerBookings();
        }}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* 3. Cancel Booking Modal */}
      <CancelBookingModal
        booking={cancelModalBooking}
        refundPiastres={cancelPreview?.refundPiastres}
        loading={!cancelPreview && !cancelError}
        error={cancelError}
        onConfirmCancel={handleConfirmCancel}
        onClose={() => setCancelModalBooking(null)}
      />
    </>
  );
}
