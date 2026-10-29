/** Memory-only public discovery cache. Never use for live slots or account data. */
export function createPublicReadCache<T>(ttlMs: number, maxEntries = 4) {
  const entries = new Map<string, { data: T; expiresAt: number }>();
  const pending = new Map<string, Promise<T>>();
  return {
    peek(key: string) {
      return entries.get(key)?.data;
    },
    load(key: string, loader: () => Promise<T>, force = false): Promise<T> {
      const running = pending.get(key);
      if (running) return running;
      const cached = entries.get(key);
      if (!force && cached && cached.expiresAt > Date.now()) return Promise.resolve(cached.data);
      const operation = loader()
        .then((data) => {
          entries.delete(key);
          entries.set(key, { data, expiresAt: Date.now() + ttlMs });
          while (entries.size > maxEntries) {
            const oldest = entries.keys().next().value;
            if (oldest === undefined) break;
            entries.delete(oldest);
          }
          return data;
        })
        .finally(() => pending.delete(key));
      pending.set(key, operation);
      return operation;
    },
  };
}
