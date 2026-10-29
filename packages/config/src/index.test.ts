import { describe, expect, it } from 'vitest';
import { businessConstants, parseEnvironment } from './index';

describe('configuration', () => {
  it('keeps locked constants centralized', () => {
    expect(businessConstants.SLOT_MINUTES).toBe(60);
    expect(businessConstants.DEPOSIT_PERCENT).toBe(30);
  });

  it('rejects missing secrets', () => {
    expect(() =>
      parseEnvironment({
        DATABASE_URL: 'postgresql://localhost/db',
      }),
    ).toThrow();
  });

  it('accepts the documented local environment contract', () => {
    const environment = parseEnvironment({
      DATABASE_URL: 'postgresql://localhost/db',
      JWT_ACCESS_SECRET: 'a'.repeat(32),
      JWT_REFRESH_SECRET: 'b'.repeat(32),
      WEB_ORIGIN: 'http://localhost:5173',
    });
    expect(environment.API_PREFIX).toBe('api/v1');
    expect(environment.PORT).toBe(3000);
  });
});
