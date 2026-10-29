import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Theme } from '../../constants/theme';
import type { PrimaryButtonProps } from '../../types/components';

export type { PrimaryButtonProps };

export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'lime',
  style,
  textStyle,
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        variant === 'lime' && styles.btnLime,
        variant === 'amber' && styles.btnAmber,
        variant === 'rose' && styles.btnRose,
        (variant === 'ghost' || variant === 'outline') && styles.btnGhost,
        disabled && styles.btnDisabled,
        style,
      ]}
      disabled={disabled || loading}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'lime' || variant === 'amber' ? '#0b1715' : '#fff'} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'lime' && styles.textDark,
            variant === 'amber' && styles.textDark,
            variant === 'rose' && styles.textLight,
            (variant === 'ghost' || variant === 'outline') && styles.textLight,
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  btn: {
    borderRadius: Theme.radii.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLime: {
    backgroundColor: Theme.colors.lime,
    shadowColor: Theme.colors.lime,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  btnAmber: {
    backgroundColor: Theme.colors.amber,
  },
  btnRose: {
    backgroundColor: Theme.colors.rose,
  },
  btnGhost: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: '900',
  },
  textDark: {
    color: '#0b1715',
  },
  textLight: {
    color: '#fff',
  },
});
