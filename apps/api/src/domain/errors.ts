export class DomainError extends Error {
  readonly isDomainError = true;
  constructor(
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
    this.name = 'DomainError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function isDomainError(error: unknown): error is DomainError {
  return (
    error instanceof DomainError ||
    (typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof (error as { code: unknown }).code === 'string' &&
      'message' in error)
  );
}
