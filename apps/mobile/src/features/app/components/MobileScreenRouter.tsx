import { Action, Copy, useMobileDesign } from '../../../components/common/MobileDesign';
import { View } from 'react-native';
import { BottomTabBar } from '../../../components/common/BottomTabBar';
import {
  ExploreTabIcon,
  BookingsTabIcon,
  ProfileTabIcon,
  InboxTabIcon,
} from '../../../components/common/TabIcons';
import { AuthScreen } from '../../../screens/auth/AuthScreen';
import { ExploreScreen } from '../../../screens/player/ExploreScreen';
import { MyBookingsScreen } from '../../../screens/player/MyBookingsScreen';
import { PlayerProfileScreen } from '../../../screens/player/PlayerProfileScreen';
import { OwnerDashboardScreen } from '../../../screens/owner/OwnerDashboardScreen';
import type { MobileAppViewProps } from '../types';
export function MobileScreenRouter({
  deleteAccount,
  cashDueTodayEgp,
  collectCash,
  completeBooking,
  handlePickOwnerPhoto,
  loadingOwner,
  markArrived,
  ownerBalance,
  ownerBookings,
  ownerProfile,
  ownerVenue,
  refreshOwnerData,
  releasedBalanceEgp,
  setShowBlockModal,
  setShowWalkInModal,
  areaFilter,
  setAreaFilter,
  areas,
  playerBookingsError,
  setIsAccountCenterOpen,
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
  savePlayerPreferences,
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
  userEmail,
  onUpdateProfile,
  userRole,
  venues,
}: Pick<
  MobileAppViewProps,
  | 'deleteAccount' | 'areas' | 'areaFilter' | 'setAreaFilter'
  | 'playerBookingsError'
  | 'setIsAccountCenterOpen'
  | 'venuesError'
  | 'refreshVenues'
  | 'browseAsGuest'
  | 'setBrowseAsGuest'
  | 'handlePlayerPhotoUploaded'
  | 'activeStrikesCount'
  | 'isLoggingIn'
  | 'lang'
  | 'loadPlayerBookings'
  | 'loadingPlayerBookings'
  | 'loadingVenues'
  | 'login'
  | 'logout'
  | 'padelLevel'
  | 'playerBookings'
  | 'playerPhotoUrl'
  | 'playerTab'
  | 'playingStyle'
  | 'preferredFoot'
  | 'register'
  | 'savePlayerPreferences'
  | 'setCancelModalBooking'
  | 'setLang'
  | 'setPlayerTab'
  | 'setSelectModalConfig'
  | 'setSelectedCourt'
  | 'setSelectedVenue'
  | 'setSportFilter'
  | 'setThemeMode'
  | 'sportFilter'
  | 't'
  | 'theme'
  | 'themeMode'
  | 'token'
  | 'userName'
  | 'userPhone'
  | 'userEmail'
  | 'onUpdateProfile'
  | 'userRole'
  | 'venues'
  | 'cashDueTodayEgp'
  | 'collectCash'
  | 'completeBooking'
  | 'handlePickOwnerPhoto'
  | 'loadingOwner'
  | 'markArrived'
  | 'ownerBalance'
  | 'ownerBookings'
  | 'ownerProfile'
  | 'ownerVenue'
  | 'refreshOwnerData'
  | 'releasedBalanceEgp'
  | 'setShowBlockModal'
  | 'setShowWalkInModal'
>) {
  const { t: copy } = useMobileDesign();
  return (
    <>
      {!token && !browseAsGuest ? (
        <View style={{ flex: 1 }}>
          <AuthScreen
            onLogin={login}
            onRegister={register}
            isLoggingIn={isLoggingIn}
            theme={theme}
            lang={lang}
          />
        </View>
      ) : userRole === 'player' || !token ? (
        <View style={{ flex: 1 }}>
          {playerTab === 'explore' && (
            <ExploreScreen
              venues={venues}
              areas={areas}
              areaFilter={areaFilter}
              onSelectArea={setAreaFilter}
              error={venuesError}
              onRetry={refreshVenues}
              loading={loadingVenues}
              sportFilter={sportFilter}
              onSelectSport={setSportFilter}
              onSelectVenue={(v) => {
                setSelectedVenue(v);
                setSelectedCourt(v.courts?.[0] ?? null);
              }}
              theme={theme}
              lang={lang}
            />
          )}

          {playerTab === 'bookings' && (
            <MyBookingsScreen
              bookings={playerBookings}
              error={playerBookingsError}
              onRefresh={() => void loadPlayerBookings()}
              loading={loadingPlayerBookings}
              onCancelPress={(b) => setCancelModalBooking(b)}
              theme={theme}
              lang={lang}
            />
          )}

          {playerTab === 'profile' && (
            <PlayerProfileScreen
              userName={userName}
              userPhone={userPhone}
              userEmail={userEmail}
              onUpdateProfile={onUpdateProfile}
              activeStrikesCount={activeStrikesCount}
              photoUrl={playerPhotoUrl}
              preferredFoot={preferredFoot}
              playingStyle={playingStyle}
              padelLevel={padelLevel}
              onPhotoUploaded={(url) => void handlePlayerPhotoUploaded(url)}
              theme={theme}
              themeMode={themeMode}
              lang={lang}
              onToggleTheme={setThemeMode}
              onToggleLang={setLang}
              onOpenSelectFoot={() =>
                setSelectModalConfig({
                  title: 'Select Preferred Foot',
                  options: [
                    { value: 'Right', label: 'Right Foot' },
                    { value: 'Left', label: 'Left Foot' },
                    { value: 'Both', label: 'Ambidextrous (Both)' },
                  ],
                  currentValue: preferredFoot,
                  onSelect: (v) => void savePlayerPreferences({ preferredFoot: v }),
                })
              }
              onOpenSelectStyle={() =>
                setSelectModalConfig({
                  title: 'Select Playing Style',
                  options: [
                    { value: 'Playmaker', label: 'Playmaker (Midfield Maestro)' },
                    { value: 'Target Man / Striker', label: 'Target Man / Striker' },
                    { value: 'Box-to-Box', label: 'Box-to-Box Engine' },
                    { value: 'Ball-Playing Defender', label: 'Ball-Playing Defender' },
                    { value: 'Sweeper Keeper', label: 'Sweeper Keeper' },
                  ],
                  currentValue: playingStyle,
                  onSelect: (v) => void savePlayerPreferences({ playingStyle: v }),
                })
              }
              onOpenSelectLevel={() =>
                setSelectModalConfig({
                  title: 'Select Padel Level',
                  options: [
                    { value: 'Beginner (1.0 - 2.0)', label: 'Beginner (1.0 - 2.0)' },
                    { value: 'Intermediate (3.5)', label: 'Intermediate (3.5)' },
                    { value: 'Advanced (4.5 - 5.0)', label: 'Advanced (4.5 - 5.0)' },
                  ],
                  currentValue: padelLevel,
                  onSelect: (v) => void savePlayerPreferences({ padelLevel: v }),
                })
              }
              onLogout={logout}
              onDeleteAccount={deleteAccount}
              hasActiveBookings={(playerBookings ?? []).some((b) => {
                if (b.status === 'cancelled' || b.status === 'completed' || b.status === 'expired') return false;
                const matchEndTime = new Date(b.endsAt ?? 0).getTime();
                return matchEndTime > Date.now() || b.status === 'confirmed' || b.status === 'held' || b.status === 'arrived';
              })}
            />
          )}

          {/* Player Bottom Tabs */}
          <BottomTabBar
            tabs={[
              {
                key: 'explore',
                icon: (props) => <ExploreTabIcon {...props} />,
                label: t.tabExplore,
              },
              {
                key: 'bookings',
                icon: (props) => <BookingsTabIcon {...props} />,
                label: t.tabBookings,
              },
              {
                key: 'profile',
                icon: (props) => <ProfileTabIcon {...props} />,
                label: t.tabProfile,
              },
              {
                key: 'inbox',
                icon: (props) => <InboxTabIcon {...props} />,
                label: copy('inbox'),
              },
            ]}
            activeTab={playerTab}
            onTabPress={(key) => {
              if (!token && key !== 'explore') {
                setBrowseAsGuest(false);
                return;
              }
              if (key === 'inbox') {
                setIsAccountCenterOpen(true);
                return;
              }
              if (key === 'explore' || key === 'bookings' || key === 'profile') setPlayerTab(key);
              if (key === 'bookings') loadPlayerBookings();
            }}
            theme={theme}
          />
        </View>
      ) : userRole === 'owner' ? (
        <View style={{ flex: 1 }}>
          <OwnerDashboardScreen
            venue={ownerVenue}
            allBookings={ownerBookings}
            balance={ownerBalance}
            ownerProfile={ownerProfile}
            onUploadPhoto={handlePickOwnerPhoto}
            onSignOut={logout}
            todaysMatches={ownerBookings.filter((b) => !['cancelled', 'expired'].includes(b.status))}
            cashDueTodayEgp={cashDueTodayEgp}
            releasedBalanceEgp={releasedBalanceEgp}
            loading={loadingOwner}
            onRefresh={refreshOwnerData}
            onAddWalkIn={() => setShowWalkInModal(true)}
            onLockMaintenance={() => setShowBlockModal(true)}
            onArrive={markArrived}
            onCollectCash={collectCash}
            onComplete={completeBooking}
            onOpenSchedule={() => {}}
            onOpenRates={() => {}}
            onOpenLedger={() => {}}
            theme={theme}
            lang={lang}
          />
        </View>
      ) : (
        /* Other roles / unauthenticated fallback */
        <View
          style={{
            flex: 1,
            padding: 24,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <Copy accent>🏟️ Mal3bna Owner Portal</Copy>
          <Copy style={{ textAlign: 'center' }}>
            Owner venue operations are available exclusively on the web dashboard at mal3bna.com.
            The mobile app is for players only.
          </Copy>
          <Action label={copy('signOut')} onPress={logout} />
        </View>
      )}
    </>
  );
}
