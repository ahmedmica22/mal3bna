const endpoint = process.env.LOAD_TEST_URL ?? 'http://127.0.0.1:3100/api/v1/health';
const requests = Number(process.env.LOAD_TEST_REQUESTS ?? 50);
const started = Date.now();
const results = await Promise.allSettled(Array.from({ length: requests }, () => fetch(endpoint)));
const fulfilled = results.filter((result) => result.status === 'fulfilled').length;
const successful = results.filter(
  (result) => result.status === 'fulfilled' && result.value.ok,
).length;
console.log(JSON.stringify({ requests, fulfilled, successful, elapsedMs: Date.now() - started }));
if (successful !== requests) process.exitCode = 1;
