/** Narrow thrown values at the UI boundary without weakening strict typing. */
export function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}
