import { Controller, Post, Body, Param } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('webhooks')
@Controller('api/webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {

  }

  @Post()
  create(@Param('runId') runId: string, @Body() createWebhookDto: Record<string, any>) {
    return this.webhooksService.create(runId, createWebhookDto);
  }
}
