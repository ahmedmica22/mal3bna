import { describe, expect, it } from 'vitest';
import { ReliableJobRunner } from './reliable-job-runner';

describe('ReliableJobRunner', () => {
  it('deduplicates effects and retries a transient failure', async () => {
    const runner = new ReliableJobRunner();
    const first = runner.enqueue('job-1', 'refund:1');
    expect(runner.enqueue('job-2', 'refund:1')).toBe(first);
    let attempts = 0;
    await runner.run(first.id, async () => {
      attempts += 1;
      if (attempts === 1) throw new Error('temporary');
    });
    const completed = await runner.run(first.id, async () => undefined);
    expect(completed?.state).toBe('completed');
    expect(completed?.attempts).toBe(2);
  });

  it('recovers processing work after a worker crash and dead-letters exhausted retries', async () => {
    const runner = new ReliableJobRunner();
    const job = runner.enqueue('job-2', 'email:2');
    await runner.run(
      job.id,
      async () => {
        throw new Error('crash');
      },
      2,
    );
    runner.recoverProcessing();
    await runner.run(
      job.id,
      async () => {
        throw new Error('still failing');
      },
      2,
    );
    expect(job.state).toBe('dead_letter');
    expect(runner.getAlerts()).toEqual(['job:job-2:dead_letter']);
  });
});
