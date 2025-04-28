import { Injectable } from '@nestjs/common';

@Injectable()
export class WebhooksService {
  create(runId: string, createWebhookDto: Record<string, any>) {
    return 'This action adds a new webhook';
  }
}
