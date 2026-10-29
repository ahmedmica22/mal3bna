import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BrandIcon } from './BrandIcon';
import type { ThemeType } from '../../constants/theme';

export interface StartingSplashScreenProps {
  theme?: ThemeType;
  lang: 'en' | 'ar';
  isRestoring?: boolean;
  onExploreGuest?: () => void;
  onSignIn?: () => void;
}

export function StartingSplashScreen({
  theme,
  lang,
  isRestoring = false,
  onExploreGuest,
  onSignIn,
}: StartingSplashScreenProps) {
  const { width, height } = useWindowDimensions();

  // Responsive breakpoints
  const isTablet = width >= 600;
  const isSmallPhone = width < 375;
  const logoSize = isTablet ? 130 : isSmallPhone ? 90 : 108;
  const titleSize = isTablet ? 36 : isSmallPhone ? 24 : 30;
  const subtitleSize = isTablet ? 16 : isSmallPhone ? 12 : 14;

  // Animation values
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const auraPulse = useRef(new Animated.Value(1)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(20)).current;
  const barShimmer = useRef(new Animated.Value(0)).current;
  const actionsFade = useRef(new Animated.Value(0)).current;
  const actionsTranslate = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    // 1. Entrance animation: Spring logo in
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Aura continuous pulse
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(auraPulse, {
          toValue: 1.15,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(auraPulse, {
          toValue: 0.95,
          duration: 1400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();

    // 3. Staggered text entrance
    Animated.parallel([
      Animated.timing(textFade, {
        toValue: 1,
        duration: 700,
        delay: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(textTranslate, {
        toValue: 0,
        duration: 700,
        delay: 300,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Bar shimmer sweep loop
    const shimmerLoop = Animated.loop(
      Animated.timing(barShimmer, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    shimmerLoop.start();

    // 5. Action buttons entrance (if actions provided and not restoring)
    if (!isRestoring) {
      Animated.parallel([
        Animated.timing(actionsFade, {
          toValue: 1,
          duration: 600,
          delay: 600,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(actionsTranslate, {
          toValue: 0,
          duration: 600,
          delay: 600,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
      ]).start();
    }

    return () => {
      pulseLoop.stop();
      shimmerLoop.stop();
    };
  }, [isRestoring]);

  const shimmerTranslate = barShimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [-80, 220],
  });

  return (
    <View style={[styles.container, { backgroundColor: '#081311' }]}>
      <StatusBar style="light" />

      {/* Ambient Stadium Glow Vignette */}
      <View
        pointerEvents="none"
        style={[
          styles.glowCircle,
          {
            width: width * 1.2,
            height: width * 1.2,
            borderRadius: (width * 1.2) / 2,
          },
        ]}
      />

      <View style={styles.centerContent}>
        {/* Animated Brand Shield with Pulsing Aura */}
        <View style={styles.logoWrapper}>
          {/* Neon Aura */}
          <Animated.View
            style={[
              styles.neonAura,
              {
                width: logoSize * 1.4,
                height: logoSize * 1.4,
                borderRadius: (logoSize * 1.4) / 2,
                transform: [{ scale: auraPulse }],
              },
            ]}
          />

          {/* Scaled Pitch Logo */}
          <Animated.View
            style={{
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
              shadowColor: '#a3e635',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <BrandIcon size={logoSize} />
          </Animated.View>
        </View>

        {/* Brand Typography */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textFade,
              transform: [{ translateY: textTranslate }],
            },
          ]}
        >
          <View style={styles.titleRow}>
            <Text style={[styles.brandTitleArabic, { fontSize: titleSize + 2 }]}>ملعبنا</Text>
            <View style={styles.dot} />
            <Text style={[styles.brandTitleEnglish, { fontSize: titleSize }]}>MAL3BNA</Text>
          </View>

          <Text style={[styles.tagline, { fontSize: subtitleSize }]}>
            {lang === 'ar'
              ? 'منصة حجز ملاعب كرة القدم والبادل في مصر'
              : 'Egypt’s Premier Football & Padel Courts'}
          </Text>

          <View style={styles.sportBadgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>⚽ Football 5 / 7 / 11</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🎾 Padel Courts</Text>
            </View>
          </View>
        </Animated.View>

        {/* Shimmer Loading Bar (during session restore / boot) */}
        {isRestoring && (
          <View style={styles.loadingContainer}>
            <View style={styles.shimmerTrack}>
              <Animated.View
                style={[
                  styles.shimmerWave,
                  {
                    transform: [{ translateX: shimmerTranslate }],
                  },
                ]}
              />
            </View>
            <Text style={styles.loadingText}>
              {lang === 'ar' ? 'جارٍ التحضير واستعادة الجلسة…' : 'Initializing matchday experience…'}
            </Text>
          </View>
        )}

        {/* Quick Launch Actions (when not restoring and on guest/auth choice) */}
        {!isRestoring && (onExploreGuest || onSignIn) && (
          <Animated.View
            style={[
              styles.actionsContainer,
              {
                opacity: actionsFade,
                transform: [{ translateY: actionsTranslate }],
                maxWidth: Math.min(width - 48, 380),
              },
            ]}
          >
            {onExploreGuest && (
              <TouchableOpacity
                activeOpacity={0.88}
                onPress={onExploreGuest}
                style={styles.primaryBtn}
              >
                <Text style={styles.primaryBtnText}>
                  {lang === 'ar' ? 'تصفح الملاعب الآن ⚡' : 'Explore Venues ⚡'}
                </Text>
              </TouchableOpacity>
            )}

            {onSignIn && (
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={onSignIn}
                style={styles.secondaryBtn}
              >
                <Text style={styles.secondaryBtnText}>
                  {lang === 'ar' ? 'تسجيل الدخول / إنشاء حساب' : 'Sign In / Create Account'}
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        )}
      </View>

      {/* Cairo Timezone & Instant Hold Badge */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {lang === 'ar'
            ? 'توقيت القاهرة الرسمي • حجز فوري مؤكد'
            : 'Africa/Cairo • Instant 10-Min Hold'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  glowCircle: {
    position: 'absolute',
    top: '25%',
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    alignSelf: 'center',
  },
  centerContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  neonAura: {
    position: 'absolute',
    backgroundColor: 'rgba(163, 230, 53, 0.12)',
  },
  textContainer: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandTitleArabic: {
    fontWeight: '900',
    color: '#bef264',
    letterSpacing: 0.5,
  },
  brandTitleEnglish: {
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  tagline: {
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 320,
    lineHeight: 20,
  },
  sportBadgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(163, 230, 53, 0.2)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  loadingContainer: {
    width: '100%',
    maxWidth: 240,
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  shimmerTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerWave: {
    width: 70,
    height: '100%',
    backgroundColor: '#a3e635',
    borderRadius: 3,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  actionsContainer: {
    width: '100%',
    gap: 12,
    marginTop: 12,
  },
  primaryBtn: {
    backgroundColor: '#a3e635',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#a3e635',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#04120e',
    fontWeight: '900',
    fontSize: 15,
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  secondaryBtnText: {
    color: '#f8fafc',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 44 : 24,
    alignSelf: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
