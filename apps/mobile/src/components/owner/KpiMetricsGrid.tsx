import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../constants/theme';
import type { KpiMetricsGridProps } from '../../types/components';

export type { KpiMetricsGridProps };

export function KpiMetricsGrid({
  todaysMatchCount,
  cashDueTodayEgp,
  releasedBalanceEgp,
  occupancyRate,
}: KpiMetricsGridProps) {
  return (
    <View style={styles.grid}>
      {/* Matches */}
      <View style={styles.card}>
        <Text style={styles.label}>TODAY'S MATCHES</Text>
        <Text style={[styles.value, { color: Theme.colors.lime }]}>{todaysMatchCount}</Text>
        <Text style={styles.sub}>Scheduled Kickoffs</Text>
      </View>

      {/* Cash Due at Venue */}
      <View style={styles.card}>
        <Text style={styles.label}>CASH DUE AT GATE</Text>
        <Text style={[styles.value, { color: Theme.colors.emerald }]}>{cashDueTodayEgp} EGP</Text>
        <Text style={styles.sub}>Collect 70% in cash</Text>
      </View>

      {/* Released Balance */}
      <View style={styles.card}>
        <Text style={styles.label}>RELEASED BALANCE</Text>
        <Text style={[styles.value, { color: Theme.colors.amber }]}>{releasedBalanceEgp} EGP</Text>
        <Text style={styles.sub}>Ready for payout</Text>
      </View>

      {/* Pitch Occupancy */}
      <View style={styles.card}>
        <Text style={styles.label}>OCCUPANCY RATE</Text>
        <Text style={[styles.value, { color: Theme.colors.sky }]}>{occupancyRate}%</Text>
        <Text style={styles.sub}>Healthy slot pace</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    flexGrow: 1,
    flexBasis: '47%',
    minWidth: 140,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.xl,
    padding: 14,
  },
  label: {
    color: Theme.colors.textDark,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 18,
    fontWeight: '900',
    marginVertical: 4,
  },
  sub: {
    color: Theme.colors.textMuted,
    fontSize: 10,
  },
});
