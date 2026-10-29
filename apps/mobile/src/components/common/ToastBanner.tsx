import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import type { ToastBannerProps } from '../../types/components';

export type { ToastBannerProps };

export function ToastBanner({ toast, animValue, onDismiss }: ToastBannerProps) {
  const insets = useSafeAreaInsets();
  const topPos = Math.max(insets.top + 10, 52);

  if (!toast) return null;

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { top: topPos, transform: [{ translateY: animValue }] },
        toast.type === 'success' && styles.toastSuccess,
        toast.type === 'error' && styles.toastError,
        toast.type === 'warning' && styles.toastWarning,
        toast.type === 'info' && styles.toastInfo,
      ]}
    >
      <View style={styles.toastIconBox}>
        <Text style={styles.toastIconText}>
          {toast.type === 'success'
            ? '✓'
            : toast.type === 'error'
              ? '✕'
              : toast.type === 'warning'
                ? '⚠'
                : 'ℹ'}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.toastTitle}>{toast.title}</Text>
        <Text style={styles.toastMessage}>{toast.message}</Text>
      </View>
      <TouchableOpacity onPress={onDismiss}>
        <Text style={styles.dismissText}>✕</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    maxWidth: 500,
    alignSelf: 'center',
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.xl,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  toastSuccess: { borderColor: 'rgba(186, 243, 94, 0.5)' },
  toastError: { borderColor: 'rgba(244, 63, 94, 0.5)' },
  toastWarning: { borderColor: 'rgba(245, 158, 11, 0.5)' },
  toastInfo: { borderColor: 'rgba(56, 189, 248, 0.5)' },
  toastIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.limeGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastIconText: {
    color: Theme.colors.lime,
    fontWeight: '900',
    fontSize: 16,
  },
  toastTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  toastMessage: {
    color: Theme.colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  dismissText: {
    color: Theme.colors.textMuted,
    fontSize: 16,
  },
});
