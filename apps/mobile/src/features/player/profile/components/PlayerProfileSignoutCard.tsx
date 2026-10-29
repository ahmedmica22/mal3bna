import { TouchableOpacity, Text, Platform, Alert } from 'react-native';
import { SignOutIcon } from '../../../../components/common/TabIcons';
import { PrimaryButton } from '../../../../components/common/PrimaryButton';

interface PlayerProfileSignoutCardProps {
  onLogout: () => void;
  onDeleteAccount?: () => void;
  isRtl: boolean;
  themeMode: 'dark' | 'light';
  signOutText: string;
  deleteAccountText?: string;
  deleteAccountConfirmText?: string;
}

export function PlayerProfileSignoutCard({
  onLogout,
  onDeleteAccount,
  isRtl,
  themeMode,
  signOutText,
  deleteAccountText,
  deleteAccountConfirmText,
}: PlayerProfileSignoutCardProps) {
  return (
    <>
      <TouchableOpacity
        style={{
          flexDirection: isRtl ? 'row-reverse' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          paddingVertical: 14,
          paddingHorizontal: 20,
          borderRadius: 16,
          marginTop: 24,
          backgroundColor:
            themeMode === 'dark' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)',
          borderWidth: 1.5,
          borderColor:
            themeMode === 'dark' ? 'rgba(248, 113, 113, 0.35)' : 'rgba(239, 68, 68, 0.3)',
          shadowColor: '#ef4444',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: themeMode === 'dark' ? 0.15 : 0.08,
          shadowRadius: 8,
          elevation: 2,
        }}
        onPress={onLogout}
        activeOpacity={0.8}
      >
        <SignOutIcon color={themeMode === 'dark' ? '#fca5a5' : '#dc2626'} size={19} />
        <Text
          style={{
            fontSize: 15,
            fontWeight: '800',
            color: themeMode === 'dark' ? '#fca5a5' : '#dc2626',
            letterSpacing: 0.3,
          }}
        >
          {signOutText}
        </Text>
      </TouchableOpacity>

      {onDeleteAccount && (
        <PrimaryButton
          title={`🗑️ ${deleteAccountText ?? 'Delete Account'}`}
          onPress={() => {
            if (Platform.OS === 'web') {
              const ok =
                typeof window !== 'undefined' &&
                window.confirm(
                  deleteAccountConfirmText ??
                    'Are you sure you want to permanently delete your account? This action cannot be undone.',
                );
              if (ok) onDeleteAccount();
              return;
            }
            Alert.alert(
              deleteAccountText ?? 'Delete Account',
              deleteAccountConfirmText ??
                'Are you sure you want to permanently delete your account? This action cannot be undone.',
              [
                { text: isRtl ? 'إلغاء' : 'Cancel', style: 'cancel' },
                {
                  text: deleteAccountText ?? 'Delete',
                  style: 'destructive',
                  onPress: onDeleteAccount,
                },
              ],
            );
          }}
          variant="ghost"
          style={{
            marginTop: 12,
            borderColor: 'rgba(239, 68, 68, 0.5)',
            backgroundColor: 'transparent',
            borderWidth: 1,
          }}
          textStyle={{ color: '#ef4444' }}
        />
      )}
    </>
  );
}
