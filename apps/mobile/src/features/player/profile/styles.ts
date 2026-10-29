import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 110,
    maxWidth: 1180,
    width: '100%',
    alignSelf: 'center',
  },
  avatarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
  },
  rowRtl: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 28,
    fontWeight: '900',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeText: {
    fontSize: 12,
  },
  headerInfo: {
    flex: 1,
  },
  changePhotoBtn: {
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 6,
  },
  changePhotoBtnText: {
    fontSize: 11,
    fontWeight: '800',
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  trustBox: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  trustTitle: {
    fontSize: 14,
    fontWeight: '800',
  },
  trustSub: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 6,
  },
  card: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
  },
  cardHeader: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  selectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  selectLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  selectValue: {
    fontSize: 13,
    fontWeight: '800',
  },
  arrow: {
    fontSize: 10,
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 8,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '800',
  },
  settingDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  togglePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
});

export type PlayerProfileStyles = typeof styles;
