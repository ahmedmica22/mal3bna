import { Body, Controller, Headers, Post } from '@nestjs/common';
import { Public } from '../../auth/presentation/metadata';
import { WebhookService, type PaymentWebhookPayload } from '../infrastructure/webhook.service';
@Controller('webhooks/fake')
export class WebhookController {
  constructor(private readonly webhooks: WebhookService) {}
  @Post()
  @Public()
  receive(@Body() body: PaymentWebhookPayload, @Headers('x-webhook-signature') signature = '') {
    return this.webhooks.receive(
      body,
      JSON.stringify(body),
      signature,
      process.env.FAKE_WEBHOOK_SECRET ?? 'local-webhook-secret',
    );
  }
}
