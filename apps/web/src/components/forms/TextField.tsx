import { useId } from 'react';
import type { TextFieldProps } from '../../types/ui';

export type { TextFieldProps };

export function TextField({
  label,
  hint,
  error,
  id,
  className = '',
  containerClassName = '',
  ...input
}: TextFieldProps) {
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const descriptionId = hint || error ? `${controlId}-description` : undefined;
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      <label
        htmlFor={controlId}
        className="block text-xs font-bold text-slate-700 dark:text-slate-300"
      >
        {label}
      </label>
      <input
        {...input}
        id={controlId}
        aria-invalid={error ? true : undefined}
        aria-describedby={descriptionId}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 disabled:opacity-50 dark:bg-[#0b1715] dark:text-slate-100 ${error ? 'border-rose-500' : 'border-slate-200 dark:border-white/15'} ${className}`}
      />
      {(hint || error) && (
        <p
          id={descriptionId}
          role={error ? 'alert' : undefined}
          className={`text-xs ${error ? 'text-rose-700 dark:text-rose-300' : 'text-slate-500 dark:text-slate-400'}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}
