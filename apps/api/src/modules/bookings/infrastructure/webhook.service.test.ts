import { describe, expect, it } from 'vitest';
import { createHmac } from 'node:crypto';
import { WebhookService } from './webhook.service';

describe('WebhookService', () => {
  it('accepts only a constant-time HMAC signature', () => {
    const service = new WebhookService({} as never, {} as never);
    const body = JSON.stringify({ eventId: 'evt-1', amountPiastres: 100 });
    const signature = createHmac('sha256', 'secret').update(body).digest('hex');
    expect(service.verifySignature(body, signature, 'secret')).toBe(true);
    expect(service.verifySignature(body, `${signature}0`, 'secret')).toBe(false);
    expect(service.verifySignature(`${body} `, signature, 'secret')).toBe(false);
  });
});
