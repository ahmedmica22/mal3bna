import React, { useState, useRef, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAppearance } from '../../../hooks/useAppearance';
import { useNativeEvents } from '../../../hooks/useNativeEvents';
import { errorMessage } from '../../../utils/errors';
import { styles } from '../styles';
import { getTheme } from '../../../constants/theme';
import { translations } from '../../../constants/translations';
import { Booking, SelectOption, OwnerProfileData } from '../../../types/domain';
import { useToast } from '../../../hooks/useToast';
import { useAuth } from '../../../hooks/useAuth';
import { useVenues } from '../../../hooks/useVenues';
import { useOwnerOperations } from '../../../hooks/useOwnerOperations';
import { bookingService } from '../../../services/booking.service';
import { ownerService } from '../../../services/owner.service';
import { usePlayerProfile } from './usePlayerProfile';
import { usePlayerBookingWorkflow } from './usePlayerBookingWorkflow';

export function useAppContent() {
  const [browseAsGuest, setBrowseAsGuest] = useState(false);
  const [checkoutAfterLogin, setCheckoutAfterLogin] = useState(false);
  const accountToken = useRef<string | null>(null);

  const [ownerTab, setOwnerTab] = useState<'overview' | 'schedule'>('overview');
  const [isAccountCenterOpen, setIsAccountCenterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playerTab, setPlayerTab] = useState<'explore' | 'bookings' | 'profile'>('explore');

  // Application Hooks
  const { toast, toastAnim, showToast, dismissToast } = useToast();
  const {
    account,
    restoring,
    sessionError,
    retrySession,
    token,
    userRole,
    userStatus,
    userName,
    userPhone,
    updateProfile,
    isLoggingIn,
    login,
    register,
    logout,
    deleteAccount,
    toggleRole,
    refreshMe,
  } = useAuth(showToast);

  const { lang, setLang, themeMode, setThemeMode, appearanceError } = useAppearance(account);
  const theme = getTheme(themeMode);
  const t = translations[lang];
  accountToken.current = token;

  const {
    sportFilter,
    setSportFilter,
    areaFilter,
    setAreaFilter,
    areas,
    venues,
    error: venuesError,
    refreshVenues,
    loading: loadingVenues,
  } = useVenues();

  // Player Bookings State & Polling
  const [playerBookingsError, setPlayerBookingsError] = useState('');
  const [playerBookings, setPlayerBookings] = useState<Booking[]>([]);
  const [loadingPlayerBookings, setLoadingPlayerBookings] = useState(false);

  async function loadPlayerBookings(silent = false) {
    if (!token || userRole !== 'player') return;
    if (!silent) setLoadingPlayerBookings(true);
    try {
      const data = await bookingService.getPlayerBookings(token);
      if (accountToken.current === token) {
        setPlayerBookings(data);
        setPlayerBookingsError('');
      }
    } catch (error) {
      if (accountToken.current === token) {
        setPlayerBookingsError(errorMessage(error, 'Could not load bookings.'));
      }
    } finally {
      if (!silent) setLoadingPlayerBookings(false);
    }
  }

  // Composed Sub-Hooks
  const playerProfile = usePlayerProfile({
    token,
    userRole,
    accountToken,
    showToast,
  });

  const bookingWorkflow = usePlayerBookingWorkflow({
    token,
    showToast,
    loadPlayerBookings,
  });

  // Owner Operations Hook
  const {
    error: ownerError,
    venue: ownerVenue,
    todaysMatches,
    cashDueTodayEgp,
    releasedBalanceEgp,
    loading: loadingOwner,
    refreshData: refreshOwnerData,
    markArrived,
    collectCash,
    completeBooking,
    addWalkInBooking,
    bookings: ownerBookings,
    balance: ownerBalance,
  } = useOwnerOperations(userRole === 'owner' ? token : null, showToast);

  const { online } = useNativeEvents({
    token,
    role: userRole,
    onPlayerBookings: () => {
      setPlayerTab('bookings');
      void loadPlayerBookings();
    },
    onOwnerBookings: () => {
      setOwnerTab('schedule');
      void refreshOwnerData();
    },
    onInbox: () => setIsAccountCenterOpen(true),
    onAccountRefresh: refreshMe,
    onError: (message) => showToast('error', 'Link', message),
    onVerified: () =>
      showToast(
        'success',
        lang === 'ar' ? 'تأكيد البريد' : 'Email verified',
        lang === 'ar' ? 'تم تأكيد بريدك الإلكتروني.' : 'Your email address was verified.',
      ),
  });

  // Modals & UI Selection State
  const [selectModalConfig, setSelectModalConfig] = useState<{
    title: string;
    options: SelectOption[];
    currentValue: string;
    onSelect: (val: string) => void;
  } | null>(null);

  const [ownerProfileData, setOwnerProfileData] = useState<OwnerProfileData | null>(null);
  const [showAddCourtModal, setShowAddCourtModal] = useState(false);
  const [showEditVenueModal, setShowEditVenueModal] = useState(false);
  const [showManagePhotosModal, setShowManagePhotosModal] = useState(false);
  const [showWalkInModal, setShowWalkInModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);

  useEffect(() => {
    if (!token) {
      setPlayerBookings([]);
      setOwnerProfileData(null);
      setBrowseAsGuest(false);
      setPlayerTab('explore');
      setIsAccountCenterOpen(false);
      setPlayerBookingsError('');
    }
  }, [token]);

  useEffect(() => {
    if (token && userRole === 'player') {
      void loadPlayerBookings(playerBookings.length > 0);
      const interval = setInterval(() => void loadPlayerBookings(true), 3000);
      return () => clearInterval(interval);
    }
  }, [token, userRole, playerTab]);

  useEffect(() => {
    if (token && userRole === 'player' && checkoutAfterLogin) {
      bookingWorkflow.setIsCheckoutOpen(true);
      setCheckoutAfterLogin(false);
    }
  }, [token, userRole, checkoutAfterLogin, bookingWorkflow]);

  async function handlePickOwnerPhoto() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: false,
      quality: 0.7,
      base64: true,
    });
    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];
      const dataUrl = asset.base64
        ? `data:${asset.mimeType ?? 'image/jpeg'};base64,${asset.base64}`
        : asset.uri;
      try {
        const updated = await ownerService.updateProfile(token, { photoUrl: dataUrl });
        setOwnerProfileData(updated);
        showToast('success', 'Profile Photo Saved', 'Your avatar has been updated successfully.');
      } catch {
        showToast('error', 'Upload Failed', 'Could not save owner profile photo to server.');
      }
    }
  }

  async function handleBlockCourt(input: import('../../../hooks/useWalkInForm').WalkInInput) {
    try {
      await ownerService.block({
        courtId: input.courtId,
        startsAt: input.startsAt,
        hours: input.hours,
        reason: input.customerName,
      });
      await refreshOwnerData();
      setShowBlockModal(false);
      return true;
    } catch (error) {
      showToast('error', 'Block', errorMessage(error, 'Could not block this slot.'));
      return false;
    }
  }

  async function handleDeletePlayerAccount() {
    try {
      await deleteAccount();
      showToast(
        'success',
        t.accountDeleted ?? 'Account Deleted',
        t.accountDeletedMsg ?? 'Your account has been deleted successfully.',
      );
    } catch (error) {
      showToast(
        'error',
        t.deleteFailed ?? 'Delete Failed',
        errorMessage(error, 'Could not delete account while obligations remain.'),
      );
    }
  }

  return {
    view: 'Content',
    props: {
      appearanceError,
      deleteAccount: handleDeletePlayerAccount,
      areaFilter,
      setAreaFilter,
      areas,
      ownerError,
      playerBookingsError,
      online,
      account,
      restoring,
      sessionError,
      retrySession,
      ownerTab,
      setOwnerTab,
      isAccountCenterOpen,
      setIsAccountCenterOpen,
      browseAsGuest,
      setBrowseAsGuest,
      setCheckoutAfterLogin,
      pendingBooking: bookingWorkflow.pendingBooking,
      paymentError: bookingWorkflow.paymentError,
      venuesError,
      refreshVenues,
      cancelPreview: bookingWorkflow.cancelPreview,
      cancelError: bookingWorkflow.cancelError,
      ownerBookings,
      ownerBalance,
      handleBlockCourt,
      addWalkInBooking,
      cancelModalBooking: bookingWorkflow.cancelModalBooking,
      cashDueTodayEgp,
      checkoutDetails: bookingWorkflow.checkoutDetails,
      collectCash,
      completeBooking,
      confirmedBookingCode: bookingWorkflow.confirmedBookingCode,
      dismissToast,
      handleCompleteBooking: bookingWorkflow.handleCompleteBooking,
      handleConfirmCancel: bookingWorkflow.handleConfirmCancel,
      handlePickOwnerPhoto,
      handlePlayerPhotoUploaded: playerProfile.handlePlayerPhotoUploaded,
      activeStrikesCount: playerProfile.activeStrikesCount,
      holdSeconds: bookingWorkflow.holdSeconds,
      isBookingSubmitting: bookingWorkflow.isBookingSubmitting,
      isCheckoutOpen: bookingWorkflow.isCheckoutOpen,
      isLoggingIn,
      isSettingsOpen,
      lang,
      loadPlayerBookings,
      loadingOwner,
      loadingPlayerBookings,
      loadingVenues,
      login,
      logout,
      markArrived,
      ownerProfile: ownerProfileData,
      ownerVenue,
      padelLevel: playerProfile.padelLevel,
      paymentOption: bookingWorkflow.paymentOption,
      playerBookings,
      playerPhotoUrl: playerProfile.playerPhotoUrl,
      playerTab,
      playingStyle: playerProfile.playingStyle,
      preferredFoot: playerProfile.preferredFoot,
      refreshMe,
      refreshOwnerData,
      register,
      releasedBalanceEgp,
      selectModalConfig,
      selectedCourt: bookingWorkflow.selectedCourt,
      selectedVenue: bookingWorkflow.selectedVenue,
      setCancelModalBooking: bookingWorkflow.setCancelModalBooking,
      setCheckoutDetails: bookingWorkflow.setCheckoutDetails,
      setConfirmedBookingCode: bookingWorkflow.setConfirmedBookingCode,
      setHoldSeconds: bookingWorkflow.setHoldSeconds,
      setIsCheckoutOpen: bookingWorkflow.setIsCheckoutOpen,
      setIsSettingsOpen,
      setLang,
      setPadelLevel: playerProfile.setPadelLevel,
      setPaymentOption: bookingWorkflow.setPaymentOption,
      setPlayerTab,
      setPlayingStyle: playerProfile.setPlayingStyle,
      setPreferredFoot: playerProfile.setPreferredFoot,
      savePlayerPreferences: playerProfile.savePlayerPreferences,
      setSelectModalConfig,
      setSelectedCourt: bookingWorkflow.setSelectedCourt,
      setSelectedVenue: bookingWorkflow.setSelectedVenue,
      setShowAddCourtModal,
      setShowBlockModal,
      setShowEditVenueModal,
      setShowManagePhotosModal,
      setShowWalkInModal,
      setSportFilter,
      setThemeMode,
      showAddCourtModal,
      showBlockModal,
      showEditVenueModal,
      showManagePhotosModal,
      showToast,
      showWalkInModal,
      sportFilter,
      styles,
      t,
      theme,
      themeMode,
      toast,
      toastAnim,
      todaysMatches,
      toggleRole,
      token,
      userName,
      userPhone,
      userEmail: account?.email ?? '',
      onUpdateProfile: updateProfile,
      userRole,
      userStatus,
      venues,
    },
  } as const;
}
