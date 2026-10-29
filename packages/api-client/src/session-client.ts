import { ApiError, GeneratedApiClient, type ApiClientOptions } from './transport.js';

export interface SessionClientOptions extends Omit<ApiClientOptions, 'getAccessToken'> {
  refresh: (client: GeneratedApiClient) => Promise<string>;
  onSessionExpired?: () => void;
}

/** In-memory credentials and a single refresh for concurrent authorization failures. */
export class SessionClient {
  readonly publicClient: GeneratedApiClient;
  private token: string | null = null;
  private generation = 0;
  private refreshInFlight: Promise<void> | null = null;

  constructor(private readonly options: SessionClientOptions) {
    this.publicClient = new GeneratedApiClient({ ...options, getAccessToken: () => this.token });
  }

  setAccessToken(token: string | null): void {
    this.generation++;
    this.token = token;
    this.refreshInFlight = null;
  }

  getAccessToken(): string | null {
    return this.token;
  }

  private expire(generation: number): void {
    if (this.generation !== generation) return;
    this.setAccessToken(null);
    this.options.onSessionExpired?.();
  }

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const generation = this.generation;
    const sentToken = this.token;
    try {
      const result = await this.publicClient.request<T>(path, init);
      if (generation !== this.generation)
        throw new ApiError(0, 'SESSION_CHANGED', 'Session changed during request');
      return result;
    } catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401 || path.startsWith('/auth/'))
        throw error;
      // An old account's operation must never be replayed under a new identity.
      if (generation !== this.generation) throw error;
      if (sentToken === this.token) {
        if (!this.refreshInFlight) {
          const pending = this.options
            .refresh(this.publicClient)
            .then((token) => {
              if (generation === this.generation) this.token = token;
            })
            .catch((cause: unknown) => {
              this.expire(generation);
              throw cause;
            })
            .finally(() => {
              if (this.refreshInFlight === pending) this.refreshInFlight = null;
            });
          this.refreshInFlight = pending;
        }
        await this.refreshInFlight;
      }
      if (generation !== this.generation) throw error;
      try {
        const result = await this.publicClient.request<T>(path, init);
        if (generation !== this.generation)
          throw new ApiError(0, 'SESSION_CHANGED', 'Session changed during request');
        return result;
      } catch (retryError) {
        if (retryError instanceof ApiError && retryError.status === 401) this.expire(generation);
        throw retryError;
      }
    }
  }
}
