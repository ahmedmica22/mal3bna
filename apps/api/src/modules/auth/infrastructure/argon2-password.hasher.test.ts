import { describe, expect, it } from 'vitest';
import { Argon2PasswordHasher } from './argon2-password.hasher';

describe('Argon2PasswordHasher', () => {
  it('hashes with Argon2id and verifies only the original password', async () => {
    const hasher = new Argon2PasswordHasher();
    const hash = await hasher.hash('M2 strong password');
    expect(hash).toContain('$argon2id$');
    await expect(hasher.verify(hash, 'M2 strong password')).resolves.toBe(true);
    await expect(hasher.verify(hash, 'wrong password')).resolves.toBe(false);
  }, 15000);
});
