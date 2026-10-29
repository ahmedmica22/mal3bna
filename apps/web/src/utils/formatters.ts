/**
 * Utility formatters for presentation and currency display.
 */

export function formatEgp(
  piastres: number,
  options?: { formatted?: boolean | undefined; includeCode?: boolean | undefined } | undefined,
): string {
  const { formatted = true, includeCode = true } = options ?? {};
  const egp = (piastres ?? 0) / 100;
  const numberStr = formatted
    ? egp.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : egp.toFixed(2);

  return includeCode ? `${numberStr} EGP` : numberStr;
}

export function formatBasisPoints(bp?: number, fallback = 1000): string {
  const rate = (bp ?? fallback) / 100;
  return `${rate.toFixed(1)}%`;
}

export function truncateId(id: string, length = 8): string {
  if (!id) return '';
  return id.slice(0, length);
}
