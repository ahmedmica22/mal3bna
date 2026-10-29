import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ApiError, GeneratedApiClient, SessionClient } from '../dist/index.js';

const json = (body, status = 200) => Response.json(body, { status });
const unauthorized = () => json({ code: 'UNAUTHORIZED', message: 'Sign in' }, 401);

test('successful data from a previous account is discarded after identity changes', async () => {
  let finish;
  const client = new SessionClient({
    baseUrl: 'http://local',
    refresh: async () => assert.fail('must not refresh'),
    fetch: () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  });
  client.setAccessToken('account-a');
  const request = client.request('/me');
  client.setAccessToken('account-b');
  finish(json({ id: 'account-a' }));
  await assert.rejects(request, (error) => error.code === 'SESSION_CHANGED');
  assert.equal(client.getAccessToken(), 'account-b');
});

test('preserves structured errors and request ID without leaking a non-JSON body', async () => {
  const client = new GeneratedApiClient({
    baseUrl: 'http://local/api/v1',
    fetch: async () =>
      json(
        { code: 'SLOT_TAKEN', message: 'Taken', details: { alternatives: [] }, requestId: 'trace' },
        409,
      ),
  });
  await assert.rejects(
    client.request('/bookings'),
    (e) =>
      e instanceof ApiError &&
      e.status === 409 &&
      e.code === 'SLOT_TAKEN' &&
      e.requestId === 'trace' &&
      Array.isArray(e.details.alternatives),
  );
  const html = new GeneratedApiClient({
    baseUrl: 'http://local',
    fetch: async () => new Response('<secret>', { status: 502 }),
  });
  await assert.rejects(
    html.request('/me'),
    (e) => e.status === 502 && !e.message.includes('secret'),
  );
});

test('handles empty success and rejects malformed JSON success', async () => {
  const empty = new GeneratedApiClient({
    baseUrl: 'http://local',
    fetch: async () => new Response(null, { status: 204 }),
  });
  assert.equal(await empty.request('/logout'), undefined);
  const invalid = new GeneratedApiClient({
    baseUrl: 'http://local',
    fetch: async () => new Response('<html>'),
  });
  await assert.rejects(invalid.request('/me'), (e) => e.code === 'INVALID_RESPONSE');
});

test('rejects absolute and protocol-relative destinations before sending credentials', async () => {
  const client = new GeneratedApiClient({
    baseUrl: 'http://local',
    fetch: async () => assert.fail('must not fetch'),
  });
  for (const path of ['https://evil.test', '//evil.test', '/\\evil.test'])
    await assert.rejects(client.request(path));
});

test('twenty concurrent 401s refresh once and preserve mutation idempotency headers', async () => {
  let refreshes = 0;
  const client = new SessionClient({
    baseUrl: 'http://local',
    refresh: async () => {
      refreshes++;
      await new Promise((r) => setTimeout(r, 10));
      return 'new';
    },
    fetch: async (_url, init) => {
      assert.equal(init.headers.get('Idempotency-Key'), 'same-action');
      assert.equal(init.credentials, 'include');
      return init.headers.get('authorization') === 'Bearer new'
        ? json({ ok: true })
        : unauthorized();
    },
  });
  client.setAccessToken('old');
  const results = await Promise.all(
    Array.from({ length: 20 }, () =>
      client.request('/bookings', {
        method: 'POST',
        body: '{}',
        headers: { 'Idempotency-Key': 'same-action' },
      }),
    ),
  );
  assert.equal(results.length, 20);
  assert.equal(refreshes, 1);
});

test('failed refresh clears the session once for a concurrent group', async () => {
  let expired = 0;
  const client = new SessionClient({
    baseUrl: 'http://local',
    refresh: async () => {
      await new Promise((r) => setTimeout(r, 5));
      throw new Error('Expired');
    },
    onSessionExpired: () => expired++,
    fetch: async () => unauthorized(),
  });
  client.setAccessToken('old');
  const results = await Promise.allSettled([client.request('/me'), client.request('/me')]);
  assert.ok(results.every((r) => r.status === 'rejected'));
  assert.equal(expired, 1);
  assert.equal(client.getAccessToken(), null);
});

test('a retried 401 expires the session without an infinite refresh loop', async () => {
  let refreshes = 0;
  let calls = 0;
  const client = new SessionClient({
    baseUrl: 'http://local',
    refresh: async () => {
      refreshes++;
      return 'new';
    },
    fetch: async () => {
      calls++;
      return unauthorized();
    },
  });
  await assert.rejects(client.request('/me'));
  assert.equal(refreshes, 1);
  assert.equal(calls, 2);
  assert.equal(client.getAccessToken(), null);
});

test('logout during refresh cannot restore the old session or replay its mutation', async () => {
  let finish;
  let started;
  const ready = new Promise((resolve) => {
    started = resolve;
  });
  let calls = 0;
  const client = new SessionClient({
    baseUrl: 'http://local',
    refresh: () => {
      started();
      return new Promise((resolve) => {
        finish = resolve;
      });
    },
    fetch: async () => {
      calls++;
      return unauthorized();
    },
  });
  client.setAccessToken('old');
  const result = client.request('/bookings', { method: 'POST' });
  await ready;
  client.setAccessToken(null);
  finish('stale');
  await assert.rejects(result);
  assert.equal(client.getAccessToken(), null);
  assert.equal(calls, 1);
});

test('does not refresh login failures, forbidden responses, or network errors', async () => {
  for (const [path, status] of [
    ['/auth/login', 401],
    ['/admin/users', 403],
  ]) {
    const client = new SessionClient({
      baseUrl: 'http://local',
      refresh: async () => assert.fail('must not refresh'),
      fetch: async () => json({}, status),
    });
    await assert.rejects(client.request(path));
  }
  const client = new SessionClient({
    baseUrl: 'http://local',
    refresh: async () => assert.fail('must not refresh'),
    fetch: async () => {
      throw new TypeError('Offline');
    },
  });
  await assert.rejects(client.request('/me'), TypeError);
});
