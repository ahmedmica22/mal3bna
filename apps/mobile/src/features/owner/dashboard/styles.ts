import { StyleSheet } from 'react-native';
import { Theme } from '../../../constants/theme';
export const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  sectionHeader: {
    color: Theme.colors.lime,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  lineupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addPitchPill: {
    backgroundColor: Theme.colors.limeGlow,
    borderWidth: 1,
    borderColor: Theme.colors.limeBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.radii.sm,
  },
  addPitchPillText: {
    color: Theme.colors.lime,
    fontSize: 11,
    fontWeight: '800',
  },
  matchCounter: {
    color: Theme.colors.lime,
    fontSize: 12,
    fontWeight: '700',
  },
  courtsGrid: {
    gap: 10,
  },
  courtCard: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.xl,
    padding: 14,
  },
  courtTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courtName: {
    color: Theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  sportBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.radii.sm,
  },
  sportBadgeText: {
    color: Theme.colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  courtDetails: {
    color: Theme.colors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  courtPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  courtBadgeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Theme.radii.sm,
    borderWidth: 1,
  },
  statusApproved: {
    backgroundColor: 'rgba(186, 243, 94, 0.15)',
    borderColor: 'rgba(186, 243, 94, 0.3)',
  },
  statusApprovedText: {
    color: Theme.colors.lime,
    fontSize: 10,
    fontWeight: '800',
  },
  statusRejected: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusRejectedText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '800',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  statusPendingText: {
    color: '#fbbf24',
    fontSize: 10,
    fontWeight: '800',
  },
  courtPhotosRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  courtPhotoThumb: {
    width: 60,
    height: 44,
    borderRadius: Theme.radii.sm,
    backgroundColor: '#1e293b',
  },
  pendingCourtNotice: {
    fontSize: 10,
    color: '#fbbf24',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderWidth: 1,
    borderRadius: Theme.radii.sm,
    padding: 6,
    marginTop: 8,
  },
  rateLabel: {
    color: Theme.colors.textMuted,
    fontSize: 11,
  },
  rateValue: {
    color: Theme.colors.lime,
    fontSize: 12,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.xl,
    padding: 24,
    alignItems: 'center',
  },
  emptyTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});
