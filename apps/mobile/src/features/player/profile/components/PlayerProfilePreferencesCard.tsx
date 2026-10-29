import { View, Text, TouchableOpacity } from 'react-native';
import type { ThemeType } from '../../../../constants/theme';
import type { PlayerProfileStyles } from '../styles';

interface PlayerProfilePreferencesCardProps {
  preferredFoot: string;
  playingStyle: string;
  padelLevel: string;
  onOpenSelectFoot: () => void;
  onOpenSelectStyle: () => void;
  onOpenSelectLevel: () => void;
  isRtl: boolean;
  theme: ThemeType;
  styles: PlayerProfileStyles;
  title: string;
  labels: {
    preferredFoot: string;
    playingStyle: string;
    padelLevel: string;
  };
}

export function PlayerProfilePreferencesCard({
  preferredFoot,
  playingStyle,
  padelLevel,
  onOpenSelectFoot,
  onOpenSelectStyle,
  onOpenSelectLevel,
  isRtl,
  theme,
  styles,
  title,
  labels,
}: PlayerProfilePreferencesCardProps) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder },
      ]}
    >
      <Text
        style={[
          styles.cardHeader,
          { color: theme.colors.lime, textAlign: isRtl ? 'right' : 'left' },
        ]}
      >
        {title}
      </Text>

      <TouchableOpacity
        style={[styles.selectRow, isRtl && styles.rowRtl]}
        onPress={onOpenSelectFoot}
      >
        <Text style={[styles.selectLabel, { color: theme.colors.textMuted }]}>
          {labels.preferredFoot}
        </Text>
        <View
          style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}
        >
          <Text style={[styles.selectValue, { color: theme.colors.textPrimary }]}>
            {preferredFoot}
          </Text>
          <Text style={[styles.arrow, { color: theme.colors.lime }]}>▼</Text>
        </View>
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

      <TouchableOpacity
        style={[styles.selectRow, isRtl && styles.rowRtl]}
        onPress={onOpenSelectStyle}
      >
        <Text style={[styles.selectLabel, { color: theme.colors.textMuted }]}>
          {labels.playingStyle}
        </Text>
        <View
          style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}
        >
          <Text style={[styles.selectValue, { color: theme.colors.textPrimary }]}>
            {playingStyle}
          </Text>
          <Text style={[styles.arrow, { color: theme.colors.lime }]}>▼</Text>
        </View>
      </TouchableOpacity>

      <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />

      <TouchableOpacity
        style={[styles.selectRow, isRtl && styles.rowRtl]}
        onPress={onOpenSelectLevel}
      >
        <Text style={[styles.selectLabel, { color: theme.colors.textMuted }]}>
          {labels.padelLevel}
        </Text>
        <View
          style={{ flexDirection: isRtl ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}
        >
          <Text style={[styles.selectValue, { color: theme.colors.textPrimary }]}>
            {padelLevel}
          </Text>
          <Text style={[styles.arrow, { color: theme.colors.lime }]}>▼</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
