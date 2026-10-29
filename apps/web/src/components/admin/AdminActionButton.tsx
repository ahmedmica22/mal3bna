import { Loader2 } from 'lucide-react';
import type { AdminActionButtonProps } from '../../types/ui';

export type { AdminActionButtonProps };

export function AdminActionButton({
  children,
  variant = 'primary',
  size = 'xs',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: AdminActionButtonProps) {
  const variantStyles = {
    primary:
      'bg-lime-400 hover:bg-lime-300 text-slate-950 shadow-sm shadow-lime-400/20 active:scale-95',
    danger:
      'bg-rose-500/20 hover:bg-rose-500/30 text-rose-700 border border-rose-500/30 active:scale-95 dark:text-rose-300',
    success:
      'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm shadow-emerald-500/20 active:scale-95',
    outline:
      'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 active:scale-95 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 dark:border-white/15',
  }[variant];

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs font-bold rounded-lg',
    sm: 'px-3 py-1.5 text-xs font-bold rounded-xl',
    md: 'px-4 py-2 text-sm font-extrabold rounded-xl',
  }[size];

  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 size={12} className="animate-spin" />}
      {children}
    </button>
  );
}
