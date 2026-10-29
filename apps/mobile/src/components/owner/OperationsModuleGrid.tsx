import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Theme } from '../../constants/theme';
import type { OperationsModuleGridProps } from '../../types/components';

export type { OperationsModuleGridProps };

export function OperationsModuleGrid({
  onOpenSchedule,
  onOpenWalkIn,
  onOpenRates,
  onOpenLedger,
}: OperationsModuleGridProps) {
  return (
    <View style={styles.grid}>
      <TouchableOpacity style={styles.card} onPress={onOpenSchedule}>
        <Text style={styles.icon}>📅</Text>
        <Text style={styles.title}>Interactive Schedule</Text>
        <Text style={styles.sub}>Courts as columns, hours as rows</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onOpenWalkIn}>
        <Text style={styles.icon}>➕</Text>
        <Text style={styles.title}>Walk-In Bookings</Text>
        <Text style={styles.sub}>Record cash phone reservations</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onOpenRates}>
        <Text style={styles.icon}>🏟️</Text>
        <Text style={styles.title}>Pitch Setup & Rates</Text>
        <Text style={styles.sub}>5v5, 7v7, padel, daylight/floodlight</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={onOpenLedger}>
        <Text style={styles.icon}>💵</Text>
        <Text style={styles.title}>Ledger & Payouts</Text>
        <Text style={styles.sub}>Double-entry deposit releases</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  grid: {
    gap: 10,
  },
  card: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.lg,
    padding: 14,
  },
  icon: {
    fontSize: 20,
    marginBottom: 4,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  sub: {
    color: Theme.colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
});
