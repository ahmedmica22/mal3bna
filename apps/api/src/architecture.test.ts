import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

describe('architecture boundaries', () => {
  function sources(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const target = resolve(dir, entry.name);
      return entry.isDirectory()
        ? sources(target)
        : entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts')
          ? [target]
          : [];
    });
  }
  it('keeps all domains independent of frameworks and application/persistence layers', () => {
    const domains = sources(resolve(__dirname)).filter((file) => /[\\/]domain[\\/]/.test(file));
    for (const file of domains)
      expect(readFileSync(file, 'utf8'), file).not.toMatch(
        /from ['"].*(?:@nestjs|@prisma|infrastructure|presentation|application)/,
      );
  });
  it('keeps application services behind ports rather than concrete database adapters', () => {
    const application = sources(resolve(__dirname, 'modules')).filter((file) =>
      /[\\/]application[\\/]/.test(file),
    );
    for (const file of application)
      expect(readFileSync(file, 'utf8'), file).not.toMatch(
        /from ['"].*(?:@prisma|infrastructure|presentation)/,
      );
  });
  it('keeps domain primitives free of framework and persistence imports', () => {
    const source = readFileSync(resolve(__dirname, 'domain/money.ts'), 'utf8');
    expect(source).not.toMatch(/NestJS|@nestjs|prisma|Prisma/);
  });
});
