import {
  Calendar,
  CalendarCheck,
  CreditCard,
  DollarSign,
  Home,
  LayoutDashboard,
  MapPin,
  Scale,
  Settings,
  ShieldAlert,
  Sliders,
  User,
  Users,
  Compass,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '../types/domain';

export interface NavigationItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

export const roleNavigation: Record<Role, readonly NavigationItem[]> = {
  player: [
    { to: '/', label: 'Discover', icon: Compass, end: true },
    { to: '/bookings', label: 'My Bookings', icon: CalendarCheck },
    { to: '/profile', label: 'Profile', icon: User },
    { to: '/settings', label: 'Settings', icon: Sliders },
  ],
  owner: [
    { to: '/owner', label: 'Today', icon: Home, end: true },
    { to: '/owner/calendar', label: 'Calendar', icon: Calendar },
    { to: '/owner/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/owner/venue', label: 'Venue setup', icon: Settings },
    { to: '/owner/balance', label: 'Money', icon: DollarSign },
    { to: '/owner/profile', label: 'Profile', icon: User },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
    { to: '/admin/venues', label: 'Venues', icon: MapPin },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/disputes', label: 'Disputes', icon: Scale },
    { to: '/admin/payouts', label: 'Payouts', icon: CreditCard },
    { to: '/admin/audit', label: 'Audit log', icon: ShieldAlert },
  ],
};

export const homeForRole = (role?: Role) =>
  role === 'owner' ? '/owner' : role === 'admin' ? '/admin' : '/';
export const profileForRole = (role: Role) =>
  role === 'owner' ? '/owner/profile' : role === 'admin' ? '/admin/users' : '/profile';
