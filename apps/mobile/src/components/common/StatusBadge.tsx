import { StyleSheet, Text, View } from 'react-native';
import type { StatusBadgeProps } from '../../types/components';

export type { StatusBadgeProps };

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  const getTheme = () => {
    switch (normalized) {
      case 'active':
      case 'approved':
      case 'completed':
        return { bg: '#10b98120', border: '#10b98140', text: '#34d399', label: status };
      case 'confirmed':
        return { bg: '#baf35e20', border: '#baf35e40', text: '#baf35e', label: 'Confirmed' };
      case 'pending':
        return { bg: '#f59e0b20', border: '#f59e0b40', text: '#fbbf24', label: 'Pending Approval' };
      case 'held':
        return { bg: '#38bdf820', border: '#38bdf840', text: '#38bdf8', label: 'Payment Hold' };
      case 'suspended':
      case 'blocked':
      case 'rejected':
      case 'cancelled':
      case 'no_show':
        return {
          bg: '#f43f5e20',
          border: '#f43f5e40',
          text: '#fb7185',
          label: status.replace(/_/g, ' '),
        };
      default:
        return { bg: '#ffffff15', border: '#ffffff25', text: '#cbd5e1', label: status };
    }
  };

  const theme = getTheme();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
          paddingHorizontal: isSm ? 8 : 12,
          paddingVertical: isSm ? 3 : 5,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.text,
            fontSize: isSm ? 10 : 12,
          },
        ]}
      >
        {theme.label.toUpperCase()}
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  badge: {
    borderRadius: 99,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
