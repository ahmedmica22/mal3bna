import { useLanguage } from '../../store/LanguageStore';
import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { EntityStatus, StatusBadgeProps } from '../../types/ui';

export type { EntityStatus, StatusBadgeProps };

export function StatusBadge({
  status,
  size = 'sm',
  showIcon = true,
  className = '',
  label,
}: StatusBadgeProps) {
  const { translate } = useLanguage();
  const normalized = status.toLowerCase();

  const config: Record<string, { label: string; style: string; icon: React.ReactNode }> = {
    arrived: {
      label: translate('Checked In'),
      style: 'bg-sky-400/15 border-sky-400/30 text-sky-700 dark:text-sky-300',
      icon: <CheckCircle2 size={12} />,
    },
    active: {
      label: translate('Active'),
      style: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
      icon: <CheckCircle2 size={12} className="text-emerald-700 dark:text-emerald-400" />,
    },
    approved: {
      label: translate('Approved'),
      style: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
      icon: <ShieldCheck size={12} className="text-emerald-700 dark:text-emerald-400" />,
    },
    confirmed: {
      label: translate('Confirmed'),
      style: 'bg-lime-400/15 border-lime-400/30 text-emerald-700 dark:text-lime-400',
      icon: <CheckCircle2 size={12} className="text-emerald-700 dark:text-lime-400" />,
    },
    completed: {
      label: translate('Completed'),
      style: 'bg-emerald-400/15 border-emerald-400/30 text-emerald-700 dark:text-emerald-300',
      icon: <CheckCircle2 size={12} className="text-emerald-700 dark:text-emerald-400" />,
    },
    pending: {
      label: translate('Pending Approval'),
      style: 'bg-amber-400/15 border-amber-400/30 text-amber-800 dark:text-amber-300',
      icon: <Clock size={12} className="text-amber-800 dark:text-amber-400" />,
    },
    no_show_pending: {
      label: translate('No-Show Pending'),
      style: 'bg-amber-400/15 border-amber-400/30 text-amber-800 dark:text-amber-300',
      icon: <Clock size={12} className="text-amber-800 dark:text-amber-400" />,
    },
    held: {
      label: translate('Payment Hold'),
      style: 'bg-sky-400/15 border-sky-400/30 text-sky-700 dark:text-sky-300',
      icon: <Clock size={12} className="text-sky-700 dark:text-sky-400" />,
    },
    suspended: {
      label: translate('Suspended'),
      style: 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400',
      icon: <AlertTriangle size={12} className="text-rose-700 dark:text-rose-400" />,
    },
    blocked: {
      label: translate('Blocked'),
      style: 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400',
      icon: <XCircle size={12} className="text-rose-700 dark:text-rose-400" />,
    },
    rejected: {
      label: translate('Rejected'),
      style: 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400',
      icon: <XCircle size={12} className="text-rose-700 dark:text-rose-400" />,
    },
    cancelled: {
      label: translate('Cancelled'),
      style: 'bg-slate-500/15 border-slate-500/30 text-slate-500 dark:text-slate-400',
      icon: <XCircle size={12} className="text-slate-500 dark:text-slate-400" />,
    },
    no_show: {
      label: translate('No-Show'),
      style: 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400',
      icon: <XCircle size={12} className="text-rose-700 dark:text-rose-400" />,
    },
    open: {
      label: translate('Open'),
      style: 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-400',
      icon: <Clock size={12} className="text-amber-800 dark:text-amber-400" />,
    },
    upheld: {
      label: translate('Upheld'),
      style: 'bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-400',
      icon: <XCircle size={12} className="text-rose-700 dark:text-rose-400" />,
    },
    overturned: {
      label: translate('Overturned'),
      style: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
      icon: <CheckCircle2 size={12} className="text-emerald-700 dark:text-emerald-400" />,
    },
    unblocked: {
      label: translate('Unblocked'),
      style: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
      icon: <ShieldCheck size={12} className="text-emerald-700 dark:text-emerald-400" />,
    },
    draft: {
      label: translate('Draft'),
      style: 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-400',
      icon: <Clock size={12} className="text-amber-800 dark:text-amber-400" />,
    },
    paid: {
      label: translate('Paid'),
      style: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400',
      icon: <CheckCircle2 size={12} className="text-emerald-700 dark:text-emerald-400" />,
    },
  };

  const current = config[normalized] ?? {
    label: status.replace(/_/g, ' '),
    style:
      'bg-slate-100 border-slate-200 text-slate-600 dark:bg-white/10 dark:border-white/15 dark:text-slate-300',
    icon: <Clock size={12} className="text-slate-500 dark:text-slate-400" />,
  };

  const sizeStyle = size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border capitalize tracking-tight ${sizeStyle} ${current.style} ${className}`}
    >
      {showIcon && current.icon}
      <span>{translate(label ?? current.label)}</span>
    </span>
  );
}
