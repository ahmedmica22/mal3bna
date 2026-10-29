import type { ReactNode } from 'react';
import type { Animated, StyleProp, ViewStyle, TextStyle } from 'react-native';
import type { Booking, SelectOption, ToastMessage, Venue, SportType, Area } from './domain';
import type { ThemeType, ThemeMode } from '../constants/theme';
import type { Language } from '../constants/translations';
import type { BookingAction } from '../features/bookings/hooks/useBookingAction';
import type { CopyKey } from '../constants/interface-copy';

// --- Common UI Components ---
export interface BookingQrProps {
  code: string;
  booking?: Booking | null | undefined;
}

export interface BrandIconProps {
  size?: number | undefined;
}

export interface TabItem {
  key: string;
  icon: ReactNode | ((props: { color: string; size: number }) => ReactNode);
  label: string;
}

export interface BottomTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (key: string) => void;
  theme?: ThemeType | undefined;
}

export interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  onPress: () => void;
  theme: ThemeType;
  isDark: boolean;
}

export interface HeaderProps {
  theme: ThemeType;
  themeMode: ThemeMode;
  lang: Language;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onOpenSettings: () => void;
  isLoggedIn: boolean;
  userRole: 'player' | 'owner';
  onToggleRole: () => void;
}

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean | undefined;
  disabled?: boolean | undefined;
  variant?: 'lime' | 'amber' | 'rose' | 'ghost' | 'outline' | undefined;
  style?: ViewStyle | undefined;
  textStyle?: TextStyle | undefined;
}

export interface SelectModalProps {
  visible: boolean;
  title: string;
  options: SelectOption[];
  currentValue: string;
  onSelect: (val: string) => void;
  onClose: () => void;
}

export interface ShimmerProps {
  width?: number | `${number}%` | 'auto' | undefined;
  height?: number | `${number}%` | undefined;
  borderRadius?: number | undefined;
  style?: StyleProp<ViewStyle> | undefined;
}

export interface ShimmerSlotGridProps {
  columns?: number | undefined;
}

export interface ShimmerCourtPillsProps {
  count?: number | undefined;
}

export interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | undefined;
}

export interface ToastBannerProps {
  toast: ToastMessage | null;
  animValue: Animated.Value;
  onDismiss: () => void;
}

// --- Owner Components ---
export interface KpiMetricsGridProps {
  todaysMatchCount: number;
  cashDueTodayEgp: string;
  releasedBalanceEgp: string;
  occupancyRate: number;
}

export interface OperationsModuleGridProps {
  onOpenSchedule: () => void;
  onOpenWalkIn: () => void;
  onOpenRates: () => void;
  onOpenLedger: () => void;
}

export interface OwnerPendingApprovalCardProps {
  onRefresh: () => void;
  onSignOut: () => void;
}

// --- Player Components ---
export interface PlayerBookingCardProps {
  booking: Booking;
  onCancelPress: (booking: Booking) => void;
  onAction?: ((action: BookingAction) => void) | undefined;
  theme?: ThemeType | undefined;
  lang?: Language | undefined;
}

export interface ExploreScreenProps {
  venues: Venue[];
  areas?: Area[] | undefined;
  areaFilter?: 'all' | string | undefined;
  onSelectArea?: ((areaId: 'all' | string) => void) | undefined;
  error?: boolean | CopyKey | undefined;
  onRetry?: (() => void) | undefined;
  loading: boolean;
  sportFilter: 'all' | SportType;
  onSelectSport: (sport: 'all' | SportType) => void;
  onSelectVenue: (venue: Venue) => void;
  theme?: ThemeType | undefined;
  lang?: Language | undefined;
}
