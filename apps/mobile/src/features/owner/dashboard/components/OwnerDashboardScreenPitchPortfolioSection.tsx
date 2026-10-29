import { Text, View, TouchableOpacity, Image } from 'react-native';
import { ShimmerCourtCard } from '../../../../components/common/Shimmer';
import type { OwnerDashboardScreenContentProps } from '../types';
export function OwnerDashboardScreenPitchPortfolioSection({
  onAddCourt,
  styles,
  venue,
  loading = false,
}: Pick<OwnerDashboardScreenContentProps, 'onAddCourt' | 'styles' | 'venue' | 'loading'>) {
  return (
    <View style={{ marginTop: 20 }}>
      <View style={styles.lineupHeader}>
        <Text style={styles.sectionHeader}>PITCH PORTFOLIO ({venue?.courts?.length ?? 0})</Text>
        {onAddCourt && (
          <TouchableOpacity onPress={onAddCourt} style={styles.addPitchPill}>
            <Text style={styles.addPitchPillText}>+ Add Pitch</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.courtsGrid}>
          <ShimmerCourtCard />
          <ShimmerCourtCard />
        </View>
      ) : venue?.courts && venue.courts.length > 0 ? (
        <View style={styles.courtsGrid}>
          {venue.courts.map((court) => {
            const latestPricePiastres = court.priceRules?.[0]?.pricePiastres;
            const priceDisplay = latestPricePiastres
              ? `${latestPricePiastres / 100} EGP/hr`
              : court.price
                ? `${court.price} EGP/hr`
                : 'Configured';

            return (
              <View key={court.id} style={styles.courtCard}>
                <View style={styles.courtTopRow}>
                  <Text style={styles.courtName}>{court.name}</Text>
                  <View style={styles.courtBadgeGroup}>
                    <View style={styles.sportBadge}>
                      <Text style={styles.sportBadgeText}>
                        {court.sport === 'padel' ? '🎾 Padel' : '⚽ Football'}
                      </Text>
                    </View>
                    {court.approvalStatus === 'approved' && court.isActive ? (
                      <View style={[styles.statusBadge, styles.statusApproved]}>
                        <Text style={styles.statusApprovedText}>✓ Active</Text>
                      </View>
                    ) : court.approvalStatus === 'rejected' ? (
                      <View style={[styles.statusBadge, styles.statusRejected]}>
                        <Text style={styles.statusRejectedText}>✕ Rejected</Text>
                      </View>
                    ) : (
                      <View style={[styles.statusBadge, styles.statusPending]}>
                        <Text style={styles.statusPendingText}>⏳ Pending Approval</Text>
                      </View>
                    )}
                  </View>
                </View>

                <Text style={styles.courtDetails}>
                  {court.sport === 'football' && court.size ? `${court.size}-a-side • ` : ''}
                  {court.surface ?? 'Turf'} • {court.isIndoor ? 'Indoor' : 'Outdoor'}
                </Text>

                {court.photos && court.photos.length > 0 && (
                  <View style={styles.courtPhotosRow}>
                    {court.photos.slice(0, 3).map((p, pIdx) => {
                      const imgUrl = p.file?.storageKey ?? p.storageKey;
                      return imgUrl ? (
                        <Image key={pIdx} source={{ uri: imgUrl }} style={styles.courtPhotoThumb} />
                      ) : null;
                    })}
                  </View>
                )}

                {court.approvalStatus === 'pending' && (
                  <Text style={styles.pendingCourtNotice}>
                    ⏳ Pending Super Admin verification before accepting bookings.
                  </Text>
                )}

                <View style={styles.courtPriceRow}>
                  <Text style={styles.rateLabel}>Hourly Rate:</Text>
                  <Text style={styles.rateValue}>{priceDisplay}</Text>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Pitches Configured Yet</Text>
          <Text style={styles.emptyText}>
            Tap "+ Add Pitch" above to configure your bookable courts.
          </Text>
        </View>
      )}
    </View>
  );
}
