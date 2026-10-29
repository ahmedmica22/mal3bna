import { Text, View, TouchableOpacity } from 'react-native';
import type { SettingsModalContentProps } from '../types';
export function SettingsModalLanguageRegion({
  isRtl,
  lang,
  onToggleLang,
  styles,
  t,
  theme,
}: Pick<SettingsModalContentProps, 'isRtl' | 'lang' | 'onToggleLang' | 'styles' | 't' | 'theme'>) {
  return (
    <View style={styles.section}>
      <Text
        style={[
          styles.sectionEyebrow,
          { color: theme.colors.lime, textAlign: isRtl ? 'right' : 'left' },
        ]}
      >
        {t.languageRegion}
      </Text>

      <View style={styles.optionsGrid}>
        <TouchableOpacity
          style={[
            styles.optionCard,
            { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.cardBorder },
            lang === 'en' && { borderColor: theme.colors.lime, borderWidth: 2 },
          ]}
          onPress={() => onToggleLang('en')}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 24, marginBottom: 6 }}>🇺🇸</Text>
          <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>{t.english}</Text>
          <Text style={[styles.optionDesc, { color: theme.colors.textMuted }]}>
            Left-to-Right 
          </Text>
          {lang === 'en' && (
            <View style={[styles.activeBadge, { backgroundColor: theme.colors.lime }]}>
              <Text style={styles.activeBadgeText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionCard,
            { backgroundColor: theme.colors.inputBg, borderColor: theme.colors.cardBorder },
            lang === 'ar' && { borderColor: theme.colors.lime, borderWidth: 2 },
          ]}
          onPress={() => onToggleLang('ar')}
          activeOpacity={0.8}
        >
          <Text style={{ fontSize: 24, marginBottom: 6 }}>🇪🇬</Text>
          <Text style={[styles.optionTitle, { color: theme.colors.textPrimary }]}>{t.arabic}</Text>
          <Text style={[styles.optionDesc, { color: theme.colors.textMuted }]}>
            Right-to-Left 
          </Text>
          {lang === 'ar' && (
            <View style={[styles.activeBadge, { backgroundColor: theme.colors.lime }]}>
              <Text style={styles.activeBadgeText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
