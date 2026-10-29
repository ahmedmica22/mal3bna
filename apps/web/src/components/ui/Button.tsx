import { ButtonHTMLAttributes, ReactNode } from 'react';

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger';
  children: ReactNode;
}) {
  const variantStyles = {
    primary:
      'bg-lime-400 text-slate-950 hover:bg-lime-300 hover:shadow-lg hover:shadow-lime-400/25 active:scale-95',
    ghost:
      'bg-transparent border border-slate-200 text-white hover:bg-slate-100 active:scale-95 dark:border-white/20 dark:hover:bg-white/10',
    danger:
      'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/25 active:scale-95',
  }[variant];

  return (
    <button
      className={`button inline-flex items-center justify-center font-extrabold rounded-full px-5 py-2.5 text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
