import { StyleSheet } from 'react-native';
import { Theme } from '../../constants/theme';
export const styles = StyleSheet.create({
  container: {
    padding: 24,
    justifyContent: 'center',
    flexGrow: 1,
    backgroundColor: Theme.colors.bg,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  hero: {
    marginBottom: 20,
  },
  eyebrowChip: {
    alignSelf: 'flex-start',
    backgroundColor: Theme.colors.limeGlow,
    borderWidth: 1,
    borderColor: Theme.colors.limeBorder,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Theme.radii.sm,
    marginBottom: 8,
  },
  eyebrowText: {
    color: Theme.colors.lime,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  title: {
    color: Theme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Theme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  demoBox: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: Theme.colors.cardBorder,
    borderRadius: Theme.radii.xl,
    padding: 16,
    marginBottom: 16,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  demoTitle: {
    color: Theme.colors.lime,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  demoBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  demoBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Theme.radii.md,
    paddingVertical: 10,
    alignItems: 'center',
  },
  demoBtnPlayer: {
    borderColor: Theme.colors.lime,
    backgroundColor: Theme.colors.limeGlow,
  },
  demoBtnPlayerText: {
    color: Theme.colors.lime,
    fontWeight: '800',
    fontSize: 13,
  },
  demoBtnOwner: {
    borderColor: Theme.colors.sky,
    backgroundColor: Theme.colors.skyGlow,
  },
  demoBtnOwnerText: {
    color: Theme.colors.sky,
    fontWeight: '800',
    fontSize: 13,
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Theme.radii.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: Theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  rolePicker: {
    flexDirection: 'row',
    gap: 10,
  },
  roleOption: {
    flex: 1,
    backgroundColor: Theme.colors.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: Theme.radii.lg,
    paddingVertical: 10,
    alignItems: 'center',
  },
  roleOptionActive: {
    borderColor: Theme.colors.lime,
    backgroundColor: Theme.colors.limeGlow,
  },
  roleOptionText: {
    color: Theme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  roleOptionTextActive: {
    color: Theme.colors.lime,
    fontWeight: '900',
  },
  errorBox: {
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(244, 63, 94, 0.4)',
    borderRadius: Theme.radii.md,
    padding: 10,
  },
  errorText: {
    color: '#fda4af',
    fontSize: 12,
    fontWeight: '700',
  },
  modeToggle: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modeToggleText: {
    color: Theme.colors.lime,
    fontSize: 12,
    fontWeight: '800',
  },
});
