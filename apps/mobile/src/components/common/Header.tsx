import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMobileDesign } from './MobileDesign';
import { BrandIcon } from './BrandIcon';
import type { HeaderProps } from '../../types/components';

export type { HeaderProps };

export function Header(p: HeaderProps) {
  const { theme, t, rtl, width } = useMobileDesign();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: Math.max(insets.top, 12),
        paddingBottom: 12,
        paddingHorizontal: width >= 650 ? 28 : 16,
        borderBottomWidth: 1,
        borderColor: theme.colors.divider,
        flexDirection: rtl ? 'row-reverse' : 'row',
        gap: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <BrandIcon size={width < 360 ? 26 : 30} />
        <View style={{ flexShrink: 1 }}>
          <Text
            style={{
              color: theme.colors.lime,
              fontSize: width < 360 ? 20 : 23,
              fontWeight: '900',
              letterSpacing: -0.8,
            }}
          >
            mal3bna<Text style={{ color: theme.colors.textMuted }}>.</Text>
          </Text>
          {width >= 480 && p.isLoggedIn && (
            <Text style={{ color: theme.colors.textMuted, fontSize: 10 }}>
              {t(p.userRole === 'owner' ? 'owner' : 'player')}
            </Text>
          )}
        </View>
      </View>
      <View style={{ flexDirection: rtl ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
        {[
          {
            label: p.themeMode === 'dark' ? t('light') : t('dark'),
            value: p.themeMode === 'dark' ? '☀' : '☾',
            action: p.onToggleTheme,
          },
          {
            label: p.lang === 'en' ? 'العربية' : 'English',
            value: p.lang === 'en' ? 'ع' : 'EN',
            action: p.onToggleLang,
          },
          {
            label: t(p.isLoggedIn ? 'settings' : 'signIn'),
            value: p.isLoggedIn ? '⚙' : '→',
            action: p.onOpenSettings,
          },
        ].map((item) => (
          <Pressable
            key={item.label}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={item.action}
            style={{
              width: 44,
              minHeight: 44,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.colors.cardBorder,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.card,
            }}
          >
            <Text style={{ color: theme.colors.textPrimary, fontWeight: '800', fontSize: 16 }}>
              {item.value}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
