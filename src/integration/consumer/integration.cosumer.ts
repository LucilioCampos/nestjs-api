// integration.consumer.ts
import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Job } from 'bull';

@Processor('integrations') // <- queue name
export class IntegrationConsumer {
  constructor(private readonly service: PrismaService) { }
  @Process('incoming')
  async incomingJob(job: Job) {
    Logger.log(`\x1b[35mIntegration ${job.data.slug} is processing`, `JOB-${job.id}`);

    const flow = await this.service.flow.findFirstOrThrow({
      where: { id: job.data.flowId }
    })

    return {
      message: `Job processed with data: ${JSON.stringify(job.data)}`,
    };
  }

  @Process('children')
  async processChildren() { }
}
