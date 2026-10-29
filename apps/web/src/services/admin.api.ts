import type {
  AdminBookingPage,
  Court,
  Payout,
  AdminVenue,
  AdminUser,
  AdminDispute,
  AdminAppeal,
  StuckItem,
  AdminFinanceOverview,
} from '../types/domain';
import { request } from './http';

export const adminApi = {
  bookings: (page = 1, pageSize = 50, status?: string, search?: string) => {
    const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status && status !== 'all') params.set('status', status);
    if (search && search.trim()) params.set('search', search.trim());
    return request<AdminBookingPage>(`/admin/bookings?${params.toString()}`);
  },
  venues: () => request<AdminVenue[]>('/admin/venues'),
  courts: (status?: string) =>
    request<Court[]>(status ? '/admin/courts?status=' + status : '/admin/courts'),
  approveCourt: (id: string) =>
    request<Court>('/admin/courts/' + id + '/approve', { method: 'POST' }),
  rejectCourt: (id: string, reason?: string) =>
    request<Court>('/admin/courts/' + id + '/reject', {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  decideVenue: (id: string, decision: 'approved' | 'rejected' | 'suspended', reason?: string) =>
    request(`/admin/venues/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, reason }),
    }),
  changeCommission: (id: string, commissionBp: number) =>
    request(`/admin/venues/${id}/commission`, {
      method: 'POST',
      body: JSON.stringify({ commissionBp }),
    }),
  users: () => request<AdminUser[]>('/admin/users'),
  approveOwner: (id: string) =>
    request<AdminUser>(`/admin/owners/${id}/approve`, { method: 'POST' }),
  setUserStatus: (id: string, status: 'active' | 'blocked' | 'suspended' | 'pending') =>
    request(`/admin/users/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    }),
  disputes: () => request<AdminDispute[]>('/admin/disputes'),
  decideDispute: (id: string, decision: 'upheld' | 'overturned', note: string) =>
    request(`/admin/disputes/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision, note }),
    }),
  appeals: () => request<AdminAppeal[]>('/admin/appeals'),
  decideAppeal: (id: string, decision: 'rejected' | 'unblocked' | 'strikes_removed') =>
    request(`/admin/appeals/${id}/decision`, {
      method: 'POST',
      body: JSON.stringify({ decision }),
    }),
  payouts: () => request<Payout[]>('/admin/payouts'),
  generatePayout: (venueId: string, periodStart: string, periodEnd: string) =>
    request('/admin/payouts', {
      method: 'POST',
      body: JSON.stringify({ venueId, periodStart, periodEnd }),
    }),
  payoutAction: (id: string, action: 'approve' | 'mark_paid', paymentReference?: string) =>
    request(`/admin/payouts/${id}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, paymentReference }),
    }),
  stuckItems: () => request<StuckItem[]>('/admin/stuck-items'),
  financeOverview: () => request<AdminFinanceOverview>('/admin/finance/overview'),
};
