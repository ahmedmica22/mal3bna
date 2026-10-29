import { MobileDesignProvider, Copy, Action } from '../../../components/common/MobileDesign';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ToastBanner } from '../../../components/common/ToastBanner';
import { Header } from '../../../components/common/Header';
import { PlayerBookingModals } from '../components/PlayerBookingModals';
import { AppAuxiliaryModals } from '../components/AppAuxiliaryModals';
import type { MobileAppViewProps } from '../types';
import { MobileScreenRouter } from '../components/MobileScreenRouter';
export function MobileAppView({
  appearanceError,
  deleteAccount,areas,areaFilter,setAreaFilter,
  ownerError,playerBookingsError,
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
  pendingBooking,
  paymentError,
  venuesError,
  refreshVenues,
  cancelPreview,
  cancelError,
  ownerBookings,
  ownerBalance,
  handleBlockCourt,
  addWalkInBooking,
  cancelModalBooking,
  cashDueTodayEgp,
  checkoutDetails,
  collectCash,
  completeBooking,
  confirmedBookingCode,
  dismissToast,
  handleCompleteBooking,
  handleConfirmCancel,
  handlePickOwnerPhoto,
  handlePlayerPhotoUploaded,
  activeStrikesCount,
  holdSeconds,
  isBookingSubmitting,
  isCheckoutOpen,
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
  ownerProfile,
  ownerVenue,
  padelLevel,
  paymentOption,
  playerBookings,
  playerPhotoUrl,
  playerTab,
  playingStyle,
  preferredFoot,
  refreshMe,
  refreshOwnerData,
  register,
  releasedBalanceEgp,
  selectModalConfig,
  selectedCourt,
  selectedVenue,
  setCancelModalBooking,
  setCheckoutDetails,
  setConfirmedBookingCode,
  setHoldSeconds,
  setIsCheckoutOpen,
  setIsSettingsOpen,
  setLang,
  setPadelLevel,
  setPaymentOption,
  setPlayerTab,
  setPlayingStyle,
  savePlayerPreferences,
  setPreferredFoot,
  setSelectModalConfig,
  setSelectedCourt,
  setSelectedVenue,
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
  onUpdateProfile,
  userRole,
  userStatus,
  venues,
}: MobileAppViewProps) {
  return (
    <MobileDesignProvider theme={theme} lang={lang}>
      <View style={[styles.outerContainer, { backgroundColor: theme.colors.bg }]}>
        <StatusBar style={themeMode === 'dark' ? 'light' : 'dark'} />

        <View style={[styles.container, { backgroundColor: theme.colors.bg }]}>
          {/* Floating Centered Toast Notification */}
          <ToastBanner toast={toast} animValue={toastAnim} onDismiss={dismissToast} />

          {/* Top Header */}
          <Header
            theme={theme}
            themeMode={themeMode}
            lang={lang}
            onToggleTheme={() => setThemeMode((m) => (m === 'dark' ? 'light' : 'dark'))}
            onToggleLang={() => setLang((l) => (l === 'en' ? 'ar' : 'en'))}
            onOpenSettings={() => (token ? setIsSettingsOpen(true) : setBrowseAsGuest(false))}
            isLoggedIn={Boolean(token)}
            userRole={userRole}
            onToggleRole={toggleRole}
          />

          {restoring && (
            <View style={{ padding: 16 }}>
              <Copy>{lang === 'ar' ? 'جارٍ استعادة الجلسة…' : 'Restoring session…'}</Copy>
            </View>
          )}
          {appearanceError && <View style={{padding:16}}><Copy>{appearanceError}</Copy></View>}
          {sessionError && (
            <View style={{ padding: 16, gap: 8 }}>
              <Copy>{sessionError}</Copy>
              <Action
                secondary
                label={lang === 'ar' ? 'إعادة المحاولة' : 'Retry session'}
                onPress={() => void retrySession()}
              />
            </View>
          )}
          {account?.status === 'blocked' && (
            <View style={{ padding: 16 }}>
              <Copy>
                {lang === 'ar'
                  ? 'الحجوزات الجديدة محظورة. يمكنك إدارة حجوزاتك وتقديم طعن.'
                  : 'New bookings are blocked. Manage existing bookings or submit an appeal.'}
              </Copy>
              <Action
                secondary
                label={lang === 'ar' ? 'الطعون' : 'Appeals'}
                onPress={() => setIsAccountCenterOpen(true)}
              />
            </View>
          )}
          {!online && (
            <View style={{ padding: 16 }}>
              <Copy>
                {lang === 'ar'
                  ? 'انقطع الاتصال بالخادم. الدفع وإجراءات الحضور تتطلب اتصالاً.'
                  : 'Server connection lost. Payments and check-in require a connection.'}
              </Copy>
            </View>
          )}
          {/* Main View Router */}
          {!restoring &&
            <MobileScreenRouter
              {...{
                deleteAccount,
                areas,
                areaFilter,
                setAreaFilter,
                playerBookingsError,
                setIsAccountCenterOpen,
                savePlayerPreferences,
                venuesError,
                refreshVenues,
                browseAsGuest,
                setBrowseAsGuest,
                handlePlayerPhotoUploaded,
                activeStrikesCount,
                isLoggingIn,
                lang,
                loadPlayerBookings,
                loadingPlayerBookings,
                loadingVenues,
                login,
                logout,
                padelLevel,
                playerBookings,
                playerPhotoUrl,
                playerTab,
                playingStyle,
                preferredFoot,
                register,
                setCancelModalBooking,
                setLang,
                setPlayerTab,
                setSelectModalConfig,
                setSelectedCourt,
                setSelectedVenue,
                setSportFilter,
                setThemeMode,
                sportFilter,
                t,
                theme,
                themeMode,
                token,
                userName,
                userPhone,
                onUpdateProfile,
                userEmail: account?.email ?? '',
                userRole,
                venues,
                ownerVenue,
                ownerBookings,
                ownerBalance,
                markArrived,
                collectCash,
                completeBooking,
                cashDueTodayEgp,
                releasedBalanceEgp,
                loadingOwner,
                refreshOwnerData,
                setShowWalkInModal,
                setShowBlockModal,
                ownerProfile,
                handlePickOwnerPhoto,
              }}
            />
          }

          {/* Player Modals (Venue Details, Checkout, Cancel) */}
          <PlayerBookingModals
            selectedVenue={selectedVenue}
            selectedCourt={selectedCourt}
            setSelectedCourt={setSelectedCourt}
            setSelectedVenue={setSelectedVenue}
            setCheckoutDetails={setCheckoutDetails}
            token={token}
            userRole={userRole}
            setBrowseAsGuest={setBrowseAsGuest}
            setCheckoutAfterLogin={setCheckoutAfterLogin}
            setConfirmedBookingCode={setConfirmedBookingCode}
            setHoldSeconds={setHoldSeconds}
            isCheckoutOpen={isCheckoutOpen}
            setIsCheckoutOpen={setIsCheckoutOpen}
            confirmedBookingCode={confirmedBookingCode}
            pendingBooking={pendingBooking}
            paymentError={paymentError}
            checkoutDetails={checkoutDetails}
            paymentOption={paymentOption}
            setPaymentOption={setPaymentOption}
            holdSeconds={holdSeconds}
            isBookingSubmitting={isBookingSubmitting}
            handleCompleteBooking={handleCompleteBooking}
            setPlayerTab={setPlayerTab}
            loadPlayerBookings={loadPlayerBookings}
            cancelModalBooking={cancelModalBooking}
            cancelPreview={cancelPreview}
            cancelError={cancelError}
            handleConfirmCancel={handleConfirmCancel}
            setCancelModalBooking={setCancelModalBooking}
          />

          {/* Auxiliary Modals (Account Center, Selection, Settings) */}
          <AppAuxiliaryModals
            isAccountCenterOpen={isAccountCenterOpen}
            setIsAccountCenterOpen={setIsAccountCenterOpen}
            token={token}
            userRole={userRole}
            userName={userName}
            setPlayerTab={setPlayerTab}
            loadPlayerBookings={loadPlayerBookings}
            refreshMe={refreshMe}
            logout={logout}
            selectModalConfig={selectModalConfig}
            setSelectModalConfig={setSelectModalConfig}
            isSettingsOpen={isSettingsOpen}
            setIsSettingsOpen={setIsSettingsOpen}
            theme={theme}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            lang={lang}
            setLang={setLang}
          />
        </View>
      </View>
    </MobileDesignProvider>
  );
}
