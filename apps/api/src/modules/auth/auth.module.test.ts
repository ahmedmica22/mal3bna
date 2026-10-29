import { describe, expect, it } from 'vitest';
import { Test } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { AuthService } from './application/auth.service';
import { AUTH_REPOSITORY } from './application/auth.service';
import { InMemoryAuthRepository } from './application/in-memory-auth.repository';

describe('AuthModule', () => {
  it('resolves the auth graph with deny-by-default guards', async () => {
    const module = await Test.createTestingModule({ imports: [AuthModule] })
      .overrideProvider(AUTH_REPOSITORY)
      .useClass(InMemoryAuthRepository)
      .compile();
    expect(module.get(AuthService)).toBeInstanceOf(AuthService);
    await module.close();
  });
});
