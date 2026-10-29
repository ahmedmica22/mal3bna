import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../../constants/theme';
import type { SelectModalProps } from '../../types/components';

export type { SelectModalProps };

export function SelectModal({
  visible,
  title,
  options,
  currentValue,
  onSelect,
  onClose,
}: SelectModalProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 22);

  if (!visible) return null;

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalSheet, { paddingBottom: bottomPad }]}>
          <View style={styles.headerRow}>
            <Text style={styles.sheetTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {options.map((opt) => {
            const isSelected = opt.value === currentValue;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[styles.optionItem, isSelected && styles.optionItemActive]}
                onPress={() => {
                  onSelect(opt.value);
                  onClose();
                }}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                  {opt.label}
                </Text>
                {isSelected && <Text style={styles.checkIcon}>✓</Text>}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Theme.colors.card,
    borderTopLeftRadius: Theme.radii.sheet,
    borderTopRightRadius: Theme.radii.sheet,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    maxWidth: 540,
    width: '100%',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    color: Theme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  closeBtn: {
    color: Theme.colors.textMuted,
    fontSize: 18,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.divider,
  },
  optionItemActive: {
    backgroundColor: Theme.colors.limeGlow,
    paddingHorizontal: 8,
    borderRadius: Theme.radii.md,
  },
  optionText: {
    color: Theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  optionTextActive: {
    color: Theme.colors.lime,
    fontWeight: '900',
  },
  checkIcon: {
    color: Theme.colors.lime,
    fontWeight: '900',
    fontSize: 16,
  },
});
