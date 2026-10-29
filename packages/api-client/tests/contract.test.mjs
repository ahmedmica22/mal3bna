import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

test('every generated OpenAPI reference resolves inside the document', async () => {
  const document = JSON.parse(
    await readFile(new URL('../../../apps/api/openapi/openapi.json', import.meta.url), 'utf8'),
  );
  function visit(value) {
    if (!value || typeof value !== 'object') return;
    if (value.$ref) {
      assert.ok(value.$ref.startsWith('#/'));
      const target = value.$ref
        .slice(2)
        .split('/')
        .reduce((current, part) => current?.[part], document);
      assert.ok(target, `Unresolved reference: ${value.$ref}`);
    }
    Object.values(value).forEach(visit);
  }
  visit(document);
  assert.equal(document.paths['/auth/refresh'].post.requestBody.required, false);
  assert.ok(document.paths['/auth/login'].post.responses['201'].content);
  assert.ok(document.paths['/me'].get.responses['200'].content);
});

test('client generation is reproducible from the package working directory', async () => {
  const source = new URL('../src/generated.ts', import.meta.url);
  const before = await readFile(source, 'utf8');
  execFileSync(
    process.execPath,
    [fileURLToPath(new URL('../../../scripts/generate-api-client.mjs', import.meta.url))],
    { cwd: fileURLToPath(new URL('../', import.meta.url)) },
  );
  assert.equal(await readFile(source, 'utf8'), before);
  assert.match(before, /export type PublicUserResponse/);
  assert.match(before, /export type AuthResponse/);
});
