import { AccountCenterSheet } from '../../account/views/AccountCenterSheet';
import { SelectModal } from '../../../components/common/SelectModal';
import { SettingsModal } from '../../../components/common/SettingsModal';
import type { MobileAppViewProps } from '../types';

export type AppAuxiliaryModalsProps = Pick<
  MobileAppViewProps,
  | 'isAccountCenterOpen'
  | 'setIsAccountCenterOpen'
  | 'token'
  | 'userRole'
  | 'userName'
  | 'setPlayerTab'
  | 'loadPlayerBookings'
  | 'refreshMe'
  | 'logout'
  | 'selectModalConfig'
  | 'setSelectModalConfig'
  | 'isSettingsOpen'
  | 'setIsSettingsOpen'
  | 'theme'
  | 'themeMode'
  | 'setThemeMode'
  | 'lang'
  | 'setLang'
>;

export function AppAuxiliaryModals({
  isAccountCenterOpen,
  setIsAccountCenterOpen,
  token,
  userRole,
  userName,
  setPlayerTab,
  loadPlayerBookings,
  refreshMe,
  logout,
  selectModalConfig,
  setSelectModalConfig,
  isSettingsOpen,
  setIsSettingsOpen,
  theme,
  themeMode,
  setThemeMode,
  lang,
  setLang,
}: AppAuxiliaryModalsProps) {
  return (
    <>
      <AccountCenterSheet
        visible={isAccountCenterOpen && Boolean(token)}
        token={token}
        role={userRole}
        userName={userName}
        onClose={() => setIsAccountCenterOpen(false)}
        onOpenBookings={() => {
          setIsAccountCenterOpen(false);
          setPlayerTab('bookings');
          void loadPlayerBookings();
        }}
        onAccountChanged={async () => {
          await refreshMe();
        }}
        onSessionEnded={() => {
          setIsAccountCenterOpen(false);
          void logout();
        }}
      />

      <SelectModal
        visible={Boolean(selectModalConfig)}
        title={selectModalConfig?.title ?? ''}
        options={selectModalConfig?.options ?? []}
        currentValue={selectModalConfig?.currentValue ?? ''}
        onSelect={(val) => {
          selectModalConfig?.onSelect(val);
          setSelectModalConfig(null);
        }}
        onClose={() => setSelectModalConfig(null)}
      />

      <SettingsModal
        visible={isSettingsOpen}
        theme={theme}
        themeMode={themeMode}
        lang={lang}
        userName={userName}
        userEmail={null}
        userRole={userRole}
        onToggleTheme={(m) => setThemeMode(m)}
        onToggleLang={(l) => setLang(l)}
        onOpenAccount={() => {
          setIsSettingsOpen(false);
          setIsAccountCenterOpen(true);
        }}
        onSignOut={logout}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
