const baseUrl = process.env.STAGING_BASE_URL ?? 'http://127.0.0.1:3000/api/v1';
const requests = Number(process.env.LOAD_TEST_REQUESTS ?? 50);
const started = Date.now();
const results = await Promise.all(
  Array.from({ length: requests }, async () => {
    const response = await fetch(`${baseUrl}/public/venues`);
    return { ok: response.ok, status: response.status };
  }),
);
const successful = results.filter((result) => result.ok).length;
const errors = results.filter((result) => !result.ok).map((result) => result.status);
const report = {
  scenario: 'venue-search',
  requests,
  successful,
  errors,
  elapsedMs: Date.now() - started,
  maxLatencyBudgetMs: process.env.LOAD_TEST_MAX_LATENCY_MS
    ? Number(process.env.LOAD_TEST_MAX_LATENCY_MS)
    : null,
};
console.log(JSON.stringify(report));
if (successful !== requests) process.exitCode = 1;
