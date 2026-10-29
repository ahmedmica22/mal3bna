export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details: unknown = null,
    readonly requestId: string | null = null,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface ApiClientOptions {
  baseUrl: string;
  getAccessToken?: () => string | null;
  fetch?: typeof fetch;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

export class GeneratedApiClient {
  constructor(private readonly options: ApiClientOptions) {}

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    if (!path.startsWith('/') || path.startsWith('//') || path.includes('\\')) {
      throw new Error('API paths must be relative to the configured API origin');
    }
    const headers = new Headers(this.options.headers);
    new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    headers.set('accept', 'application/json');
    const token = this.options.getAccessToken?.();
    if (token) headers.set('authorization', `Bearer ${token}`);
    if (typeof init.body === 'string' && !headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    const response = await (this.options.fetch ?? fetch)(
      `${this.options.baseUrl.replace(/\/$/, '')}${path}`,
      { ...init, headers, credentials: this.options.credentials ?? 'include' },
    );
    const text = await response.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : undefined;
    } catch {
      if (response.ok)
        throw new ApiError(response.status, 'INVALID_RESPONSE', 'Expected a JSON API response');
    }
    if (!response.ok) {
      const error = record(body);
      throw new ApiError(
        response.status,
        typeof error.code === 'string' ? error.code : 'API_ERROR',
        typeof error.message === 'string' ? error.message : 'API request failed',
        error.details,
        typeof error.requestId === 'string'
          ? error.requestId
          : response.headers.get('x-request-id'),
      );
    }
    return body as T;
  }
}
