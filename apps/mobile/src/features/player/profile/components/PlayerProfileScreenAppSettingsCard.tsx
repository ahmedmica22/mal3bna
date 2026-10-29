import { Text, View, TouchableOpacity } from 'react-native';
import type { PlayerProfileScreenContentProps } from '../types';
export function PlayerProfileScreenAppSettingsCard({
  isRtl,
  lang,
  onToggleLang,
  onToggleTheme,
  styles,
  t,
  theme,
  themeMode,
}: Pick<
  PlayerProfileScreenContentProps,
  'isRtl' | 'lang' | 'onToggleLang' | 'onToggleTheme' | 'styles' | 't' | 'theme' | 'themeMode'
>) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, marginTop: 16 },
      ]}
    >
      <Text
        style={[
          styles.cardHeader,
          { color: theme.colors.lime, textAlign: isRtl ? 'right' : 'left' },
        ]}
      >
        {t.settingsTitle}
      </Text>

      {/* Theme Row */}
      <View style={[styles.settingRow, isRtl && styles.rowRtl]}>
        <View>
          <Text
            style={[
              styles.settingLabel,
              { color: theme.colors.textPrimary, textAlign: isRtl ? 'right' : 'left' },
            ]}
          >
            {t.appearance}
          </Text>
          <Text
            style={[
              styles.settingDesc,
              { color: theme.colors.textMuted, textAlign: isRtl ? 'right' : 'left' },
            ]}
          >
            {themeMode === 'dark' ? t.darkMode : t.lightMode}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={[
              styles.togglePill,
              { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.cardBorder },
              themeMode === 'dark' && {
                borderColor: theme.colors.lime,
                backgroundColor: theme.colors.limeGlow,
              },
            ]}
            onPress={() => onToggleTheme('dark')}
          >
            <Text style={{ fontSize: 13 }}>🌙 Dark</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.togglePill,
              { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.cardBorder },
              themeMode === 'light' && {
                borderColor: theme.colors.lime,
                backgroundColor: theme.colors.limeGlow,
              },
            ]}
            onPress={() => onToggleTheme('light')}
          >
            <Text style={{ fontSize: 13 }}>☀️ Light</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

      {/* Language Row */}
      <View style={[styles.settingRow, isRtl && styles.rowRtl]}>
        <View>
          <Text
            style={[
              styles.settingLabel,
              { color: theme.colors.textPrimary, textAlign: isRtl ? 'right' : 'left' },
            ]}
          >
            {t.languageRegion}
          </Text>
          <Text
            style={[
              styles.settingDesc,
              { color: theme.colors.textMuted, textAlign: isRtl ? 'right' : 'left' },
            ]}
          >
            {lang === 'en' ? 'English ' : 'العربية '}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            style={[
              styles.togglePill,
              { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.cardBorder },
              lang === 'en' && {
                borderColor: theme.colors.lime,
                backgroundColor: theme.colors.limeGlow,
              },
            ]}
            onPress={() => onToggleLang('en')}
          >
            <Text style={{ fontSize: 13 }}>🇺🇸 EN</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.togglePill,
              { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.cardBorder },
              lang === 'ar' && {
                borderColor: theme.colors.lime,
                backgroundColor: theme.colors.limeGlow,
              },
            ]}
            onPress={() => onToggleLang('ar')}
          >
            <Text style={{ fontSize: 13 }}>🇪🇬 عربي</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
