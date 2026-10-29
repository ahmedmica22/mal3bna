import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Theme } from '../../constants/theme';
import { SignOutIcon } from '../common/TabIcons';
import type { OwnerPendingApprovalCardProps } from '../../types/components';

export type { OwnerPendingApprovalCardProps };

export function OwnerPendingApprovalCard({ onRefresh, onSignOut }: OwnerPendingApprovalCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={{ fontSize: 32 }}>⏳</Text>
        </View>

        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>Owner Request Under Review</Text>
        </View>

        <Text style={styles.title}>Awaiting Super Admin Approval</Text>

        <Text style={styles.description}>
          Your owner account has been registered and is currently pending review by the Super Admin.
          Once approved, you will be able to enter and submit your venue details, pitches, and
          hourly rates.
        </Text>

        <TouchableOpacity style={styles.primaryButton} onPress={onRefresh} activeOpacity={0.85}>
          <Text style={styles.primaryButtonText}>Refresh Approval Status</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.secondaryButton,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 14,
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 1,
              borderColor: 'rgba(248, 113, 113, 0.3)',
              marginTop: 6,
            },
          ]}
          onPress={onSignOut}
          activeOpacity={0.8}
        >
          <SignOutIcon color="#fca5a5" size={15} />
          <Text style={[styles.secondaryButtonText, { color: '#fca5a5', fontWeight: '800' }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#13221f',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#f59e0b40',
    padding: 28,
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#f59e0b20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: '#f59e0b20',
    borderWidth: 1,
    borderColor: '#f59e0b40',
    marginBottom: 12,
  },
  badgeText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    color: '#f8fafc',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  description: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: Theme.colors.lime,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: Theme.colors.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: '#0b1715',
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
  },
});
