import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleProp, ViewStyle, Easing } from 'react-native';
import { useMobileDesign } from './MobileDesignContext';
import type { ShimmerProps, ShimmerSlotGridProps, ShimmerCourtPillsProps } from '../../types/components';

export type { ShimmerProps, ShimmerSlotGridProps, ShimmerCourtPillsProps };

export function Shimmer({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: ShimmerProps) {
  const { theme } = useMobileDesign();
  const isDark = theme.colors.bg !== '#ffffff';
  const pulseAnim = useRef(new Animated.Value(0.4)).current;
  const sweepAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // Pulse animation
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.85,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    // Continuous sweep wave animation
    const sweep = Animated.loop(
      Animated.timing(sweepAnim, {
        toValue: 1,
        duration: 1600,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    pulse.start();
    sweep.start();

    return () => {
      pulse.stop();
      sweep.stop();
    };
  }, [pulseAnim, sweepAnim]);

  const baseColor = isDark ? 'rgba(163, 230, 53, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const highlightColor = isDark ? 'rgba(190, 242, 100, 0.18)' : 'rgba(255, 255, 255, 0.55)';

  const sweepTranslate = sweepAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-120, 240],
  });

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height: height as any,
          borderRadius,
          backgroundColor: baseColor,
          opacity: pulseAnim,
          overflow: 'hidden',
          position: 'relative',
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: highlightColor,
          transform: [{ translateX: sweepTranslate }, { skewX: '-20deg' }],
        }}
      />
    </Animated.View>
  );
}

export function ShimmerVenueCard() {
  const { theme } = useMobileDesign();
  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.cardBorder,
        borderWidth: 1,
        borderRadius: 24,
        padding: 20,
        gap: 14,
        overflow: 'hidden',
      }}
    >
      {/* Venue Photo Skeleton */}
      <Shimmer height={170} borderRadius={18} />
      {/* Title */}
      <Shimmer width="65%" height={24} borderRadius={8} />
      {/* Address */}
      <Shimmer width="45%" height={16} borderRadius={6} />
      {/* Description */}
      <Shimmer width="90%" height={14} borderRadius={6} />
      {/* Footer Badges */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
        <Shimmer width={70} height={26} borderRadius={14} />
        <Shimmer width={85} height={26} borderRadius={14} />
      </View>
    </View>
  );
}

export function ShimmerBookingCard() {
  const { theme } = useMobileDesign();
  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.cardBorder,
        borderWidth: 1,
        borderRadius: 24,
        padding: 20,
        gap: 12,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Shimmer width={100} height={18} borderRadius={6} />
        <Shimmer width={75} height={24} borderRadius={12} />
      </View>
      {/* Venue Name & Court */}
      <Shimmer width="60%" height={22} borderRadius={8} />
      <Shimmer width="40%" height={16} borderRadius={6} />
      {/* Match Date */}
      <Shimmer width="70%" height={16} borderRadius={6} />
      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        <Shimmer width="48%" height={40} borderRadius={14} />
        <Shimmer width="48%" height={40} borderRadius={14} />
      </View>
    </View>
  );
}

export function ShimmerSlotGrid({ columns = 1 }: ShimmerSlotGridProps) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <View key={i} style={{ width: columns > 1 ? '23%' : '30.5%' }}>
          <Shimmer height={54} borderRadius={14} />
        </View>
      ))}
    </View>
  );
}

export function ShimmerCourtPills({ count = 3 }: ShimmerCourtPillsProps) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer
          key={i}
          width={i === 0 ? 100 : i === 1 ? 115 : 90}
          height={38}
          borderRadius={20}
        />
      ))}
    </View>
  );
}

export function ShimmerAreaChips({ count = 4 }: { count?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8, paddingVertical: 6 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer
          key={i}
          width={i === 0 ? 110 : i === 1 ? 95 : i === 2 ? 120 : 85}
          height={34}
          borderRadius={18}
        />
      ))}
    </View>
  );
}

export function ShimmerCourtCard() {
  const { theme } = useMobileDesign();
  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.cardBorder,
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        gap: 12,
        overflow: 'hidden',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Shimmer width={120} height={20} borderRadius={6} />
        <Shimmer width={70} height={24} borderRadius={12} />
      </View>
      <Shimmer width="60%" height={14} borderRadius={6} />
      <Shimmer width="40%" height={16} borderRadius={6} />
    </View>
  );
}

export function ShimmerReviewCard() {
  const { theme } = useMobileDesign();
  return (
    <View
      style={{
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.cardBorder,
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        gap: 10,
        overflow: 'hidden',
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Shimmer width={80} height={16} borderRadius={6} />
        <Shimmer width={60} height={16} borderRadius={6} />
      </View>
      <Shimmer width="90%" height={14} borderRadius={6} />
      <Shimmer width="60%" height={14} borderRadius={6} />
    </View>
  );
}

export function ShimmerProfile() {
  const { theme } = useMobileDesign();
  return (
    <View style={{ gap: 16, padding: 20 }}>
      {/* Avatar Card */}
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          borderWidth: 1,
          borderRadius: 24,
          padding: 24,
          alignItems: 'center',
          gap: 14,
        }}
      >
        <Shimmer width={96} height={96} borderRadius={48} />
        <Shimmer width={160} height={22} borderRadius={8} />
        <Shimmer width={120} height={14} borderRadius={6} />
      </View>

      {/* Details Card */}
      <View
        style={{
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.cardBorder,
          borderWidth: 1,
          borderRadius: 24,
          padding: 20,
          gap: 16,
        }}
      >
        <Shimmer width={140} height={20} borderRadius={6} />
        <Shimmer width="100%" height={44} borderRadius={12} />
        <Shimmer width="100%" height={44} borderRadius={12} />
        <Shimmer width="45%" height={40} borderRadius={20} />
      </View>
    </View>
  );
}
