export type JobState = 'pending' | 'processing' | 'completed' | 'dead_letter';

export interface JobRecord {
  id: string;
  effectKey: string;
  attempts: number;
  state: JobState;
  lastError?: string;
}

export class ReliableJobRunner {
  private readonly jobs = new Map<string, JobRecord>();
  private readonly alerts: string[] = [];

  enqueue(id: string, effectKey: string) {
    const existing = [...this.jobs.values()].find((job) => job.effectKey === effectKey);
    if (existing) return existing;
    const job: JobRecord = { id, effectKey, attempts: 0, state: 'pending' };
    this.jobs.set(id, job);
    return job;
  }

  async run(id: string, task: () => Promise<void>, maxAttempts = 3) {
    const job = this.jobs.get(id);
    if (!job || job.state === 'completed' || job.state === 'dead_letter') return job;
    job.state = 'processing';
    job.attempts += 1;
    try {
      await task();
      job.state = 'completed';
      return job;
    } catch (error) {
      job.lastError = error instanceof Error ? error.message : 'Unknown error';
      if (job.attempts >= maxAttempts) {
        job.state = 'dead_letter';
        this.alerts.push(`job:${job.id}:dead_letter`);
      } else job.state = 'pending';
      return job;
    }
  }

  recoverProcessing() {
    for (const job of this.jobs.values()) if (job.state === 'processing') job.state = 'pending';
  }

  getAlerts() {
    return [...this.alerts];
  }
}
