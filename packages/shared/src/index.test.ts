import { describe, expect, it } from 'vitest';
import { roleSchema } from './index';

describe('shared contracts', () => {
  it('allows only the three immutable roles', () => {
    expect(roleSchema.options).toEqual(['player', 'owner', 'admin']);
    expect(roleSchema.safeParse('staff').success).toBe(false);
  });
});
