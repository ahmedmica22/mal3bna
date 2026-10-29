import { Text, View, TouchableOpacity } from 'react-native';
import type { SettingsModalContentProps } from '../types';
export function SettingsModalAppearance({
  isRtl,
  onToggleTheme,
  styles,
  t,
  theme,
  themeMode,
}: Pick<
  SettingsModalContentProps,
  'isRtl' | 'onToggleTheme' | 'styles' | 't' | 'theme' | 'themeMode'
>) {
  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionEyebrow,
          { color: theme.colors.lime, textAlign: isRtl ? 'right' : 'left' },
        ]}
      >
        {t.appearance}
      </Text>

      <View style={styles.optionsGrid}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.cardBorder },
            themeMode === 'dark' && { borderColor: theme.colors.lime, borderWidth: 2 },
          ]}
          onPress={() => onToggleTheme('dark')}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 24, marginBottom: 6 }}>🌙</Text>
          <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>
            {t.darkMode}
          </Text>
          <Text style={[styles.optionDesc, { color: theme.colors.textMuted }]}>
            Stadium Night Tone
          </Text>
          {themeMode === 'dark' && (
            <View style={[styles.activeBadge, { backgroundColor: theme.colors.lime }]}>
              <Text style={styles.activeBadgeText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.cardBorder },
            themeMode === 'light' && { borderColor: theme.colors.lime, borderWidth: 2 },
          ]}
          onPress={() => onToggleTheme('light')}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 24, marginBottom: 6 }}>☀️</Text>
          <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>
            {t.lightMode}
          </Text>
          <Text style={[styles.optionDesc, { color: theme.colors.textMuted }]}>
            Clean Daylight Tone
          </Text>
          {themeMode === 'light' && (
            <View style={[styles.activeBadge, { backgroundColor: theme.colors.lime }]}>
              <Text style={styles.activeBadgeText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
