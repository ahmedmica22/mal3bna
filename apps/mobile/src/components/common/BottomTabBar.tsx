import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform, Animated } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme, ThemeType } from '../../constants/theme';
import type { TabItem, BottomTabBarProps, TabButtonProps } from '../../types/components';

export type { TabItem, BottomTabBarProps, TabButtonProps };

function TabButton({ tab, isActive, onPress, theme, isDark }: TabButtonProps) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const activeAnim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(activeAnim, {
      toValue: isActive ? 1 : 0,
      tension: 68,
      friction: 9,
      useNativeDriver: true,
    }).start();
  }, [isActive, activeAnim]);

  const handlePressIn = () => {
    Animated.spring(pressScale, {
      toValue: 0.91,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressScale, {
      toValue: 1,
      friction: 4,
      tension: 160,
      useNativeDriver: true,
    }).start();
  };

  const activeScale = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.82, 1],
  });

  const activeOpacity = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const iconScale = activeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.16],
  });

  const iconColor = isActive
    ? (isDark ? theme.colors.lime : '#0f5132')
    : theme.colors.textMuted;

  return (
    <Animated.View style={[styles.tabButtonWrapper, { transform: [{ scale: pressScale }] }]}>
      <TouchableOpacity
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        accessibilityLabel={tab.label}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.88}
        style={styles.tabButton}
      >
        {/* Animated Frosted Active Pill */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.activePillBackground,
            {
              backgroundColor: isDark
                ? 'rgba(226, 254, 73, 0.16)'
                : 'rgba(22, 163, 74, 0.12)',
              borderColor: isDark
                ? 'rgba(226, 254, 73, 0.32)'
                : 'rgba(22, 163, 74, 0.22)',
              opacity: activeOpacity,
              transform: [{ scale: activeScale }],
            },
          ]}
        />

        <Animated.View
          style={[
            styles.tabIcon,
            {
              transform: [{ scale: iconScale }],
              opacity: isActive ? 1 : 0.65,
            },
          ]}
        >
          {typeof tab.icon === 'function' ? (
            tab.icon({ color: iconColor, size: 21 })
          ) : typeof tab.icon === 'string' ? (
            <Text style={styles.tabIconText}>{tab.icon}</Text>
          ) : (
            tab.icon
          )}
        </Animated.View>

        <Text
          numberOfLines={1}
          style={[
            styles.tabLabel,
            {
              color: isActive
                ? (isDark ? theme.colors.lime : '#0f5132')
                : theme.colors.textMuted,
              fontWeight: isActive ? '900' : '600',
            },
          ]}
        >
          {tab.label}
        </Text>

        {/* Glowing Indicator Dot */}
        <Animated.View
          style={[
            styles.activeDot,
            {
              backgroundColor: isDark ? theme.colors.lime : '#16a34a',
              opacity: activeOpacity,
              transform: [{ scale: activeScale }],
            },
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function BottomTabBar({ tabs, activeTab, onTabPress, theme = Theme }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomMargin = Math.max(insets.bottom, 12);
  const isDark = theme.colors.bg !== '#ffffff';

  return (
    <View style={[styles.outerWrapper, { bottom: bottomMargin }]} pointerEvents="box-none">
      {/* Outer Shadow Wrapper for iOS/Android Depth */}
      <View style={styles.dockShadow}>
        {/* Frosted iPhone Glass Container */}
        <BlurView
          intensity={Platform.OS === 'ios' ? 75 : 90}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.dockContainer,
            {
              backgroundColor: isDark
                ? 'rgba(12, 22, 19, 0.72)'
                : 'rgba(255, 255, 255, 0.78)',
              borderColor: isDark
                ? 'rgba(255, 255, 255, 0.16)'
                : 'rgba(0, 0, 0, 0.09)',
            },
          ]}
        >
          {/* Specular Top Glass Reflection Line */}
          <View
            style={[
              styles.specularLine,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.24)'
                  : 'rgba(255, 255, 255, 0.9)',
              },
            ]}
          />

          <View style={styles.buttonsRow}>
            {tabs.map((tab) => (
              <TabButton
                key={tab.key}
                tab={tab}
                isActive={activeTab === tab.key}
                onPress={() => onTabPress(tab.key)}
                theme={theme}
                isDark={isDark}
              />
            ))}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 100,
  },
  dockShadow: {
    width: '100%',
    maxWidth: 440,
    borderRadius: 36,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
      android: {
        elevation: 14,
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
      },
    }),
  },
  dockContainer: {
    borderRadius: 36,
    borderWidth: 1.2,
    overflow: 'hidden',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  specularLine: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    borderRadius: 1,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  tabButtonWrapper: {
    flex: 1,
    marginHorizontal: 2,
  },
  tabButton: {
    minHeight: 48,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  activePillBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 22,
    borderWidth: 1,
  },
  tabIcon: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  tabIconText: {
    fontSize: 18,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: -0.2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
