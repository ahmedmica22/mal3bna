import { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes, ReactNode } from 'react';

export function AdminTableCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-slate-50 shadow-2xl backdrop-blur-md overflow-x-auto  dark:border-white/10 dark:bg-[#0b1715]/90 ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

export function AdminTable({
  children,
  minWidth = 'min-w-[700px]',
  className = '',
  ...props
}: HTMLAttributes<HTMLTableElement> & {
  minWidth?: string | undefined;
}) {
  return (
    <table className={`w-full border-collapse ${minWidth} ${className}`} {...props}>
      {children}
    </table>
  );
}

export function AdminTableHead({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={`border-b border-slate-200 text-start text-xs font-black text-emerald-700 uppercase tracking-wider  dark:border-white/10 dark:text-lime-400 ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

export function AdminTableHeaderCell({
  children,
  align = 'left',
  className = '',
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & {
  align?: 'left' | 'center' | 'right' | undefined;
}) {
  const alignClass =
    align === 'right' ? 'text-end' : align === 'center' ? 'text-center' : 'text-start';

  return (
    <th className={`p-4 ${alignClass} ${className}`} {...props}>
      {children}
    </th>
  );
}

export function AdminTableBody({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={`divide-y divide-white/5 text-xs ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export function AdminTableRow({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={`hover:bg-white/[0.02] transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function AdminTableCell({
  children,
  align = 'left',
  className = '',
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & {
  align?: 'left' | 'center' | 'right' | undefined;
}) {
  const alignClass =
    align === 'right' ? 'text-end' : align === 'center' ? 'text-center' : 'text-start';

  return (
    <td className={`p-4 ${alignClass} ${className}`} {...props}>
      {children}
    </td>
  );
}
