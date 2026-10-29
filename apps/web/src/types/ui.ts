import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import type { AdminUser, AdminVenue } from './domain';

// --- Admin Components ---
export interface AdminActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'danger' | 'success' | 'outline' | undefined;
  size?: 'xs' | 'sm' | 'md' | undefined;
  isLoading?: boolean | undefined;
}

export interface AdminAlertBannerProps {
  pendingOwnersCount: number;
  pendingVenuesCount: number;
  openDisputesCount: number;
  pendingAppealsCount: number;
}

export interface AdminModuleCardProps {
  to: string;
  eyebrow: string;
  title: string;
  description: string;
  footerLeft: string;
  footerRight: string;
  tone?: 'rose' | 'sky' | 'amber' | 'emerald' | undefined;
}

export interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string | undefined;
  children?: ReactNode | undefined;
  className?: string | undefined;
}

export interface CommissionEditorProps {
  commissionBp?: number | undefined;
  onSave: (newBp: number) => Promise<void>;
  isSaving?: boolean | undefined;
}

export interface PendingOwnersQueueProps {
  owners: AdminUser[];
  approvingOwnerId: string | null;
  onApprove: (ownerId: string, ownerName: string) => Promise<void>;
}

export interface VenueTableRowProps {
  venue: AdminVenue;
  isLoading: boolean;
  onDecision: (venue: AdminVenue, decision: 'approved' | 'rejected' | 'suspended') => Promise<void>;
  onCommissionSave: (venueId: string, bp: number) => Promise<void>;
}

export interface AdminOperationsPageProps {
  kind: 'users' | 'disputes' | 'payouts' | 'stuck';
}

export interface BrandIconProps {
  size?: number | undefined;
  className?: string | undefined;
}

// --- Forms & Layout Components ---
export interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  containerClassName?: string;
}

export interface PageHeaderProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}

export interface OwnerPendingBannerProps {
  userName?: string;
  onRefresh?: () => void;
  compact?: boolean;
}

// --- UI Primitives ---
export interface CalendarMonthViewProps {
  viewYear: number;
  viewMonth: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  selectedDateStr: string | null | undefined;
  minDateStr?: string | undefined;
  maxDateStr?: string | undefined;
  todayStr: string;
  onSelectDate: (dateStr: string) => void;
}

export interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  min?: string | undefined;
  max?: string | undefined;
  placeholder?: string | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  align?: 'left' | 'right' | undefined;
}

export interface DateTimePickerProps {
  value: string; // YYYY-MM-DDTHH:mm or ISO string
  onChange: (value: string) => void;
  min?: string | undefined;
  placeholder?: string | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
  align?: 'left' | 'right' | undefined;
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: ReactNode | undefined;
  icon: ReactNode;
  href?: string | undefined;
  tone?: 'lime' | 'emerald' | 'amber' | 'sky' | 'rose' | 'purple' | undefined;
  onClick?: (() => void) | undefined;
}

export interface SectionTab<T extends string = string> {
  id: T;
  label: string;
  icon?: LucideIcon | undefined;
  badge?: number | undefined;
}

export interface SelectOption {
  value: string;
  label: string;
  icon?: ReactNode | undefined;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string | undefined;
  className?: string | undefined;
  disabled?: boolean | undefined;
}

export type EntityStatus =
  | 'active'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'blocked'
  | 'held'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'no_show'
  | 'no_show_pending'
  | 'open'
  | 'upheld'
  | 'overturned'
  | 'unblocked'
  | 'draft'
  | 'paid'
  | string;

export interface StatusBadgeProps {
  status: EntityStatus;
  size?: 'sm' | 'md' | undefined;
  showIcon?: boolean | undefined;
  className?: string | undefined;
  label?: string | undefined;
}

// --- Feedback & Store Types ---
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string | undefined;
  message: string;
  duration?: number | undefined;
}

export interface ToastContextValue {
  toast: {
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
    dismiss: (id: string) => void;
  };
}

export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  theme: Theme;
  dark: boolean;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}
