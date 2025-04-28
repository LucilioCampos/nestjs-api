// jobs.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';


export interface IncomingProps {
  flowId: number
  retries?: number
  slug: string
  content: any
}
@Injectable()
export class IntegrationProducer implements OnModuleInit {
  constructor(@InjectQueue('integrations') private readonly integrationQueue: Queue) { }

  onModuleInit() {
    this.integrationQueue.on('completed', (job: Job, result: any) => {
      Logger.log("\x1b[35mIntegration Finished!", `JOB-${job.id}`)
    });

    this.integrationQueue.on('failed', (job: Job, error: Error) => {
      Logger.log("\x1b[35mIntegration faield!", `JOB-${job.id}`)
    });

    this.integrationQueue.on('active', (job: Job) => {
      Logger.log("\x1b[35mIntegration is now active!", `JOB-${job.id}`)
    });

    this.integrationQueue.on('waiting', (jobId: string | number) => {
      Logger.log(`\x1b[35mIntegration is waiting`, `JOB-${jobId}`)
    });

    this.integrationQueue.on('stalled', (job: Job) => {
      Logger.log(`\x1b[35mIntegration is stalled`, `JOB-${job.id}`);
    });
  }

  async incomingJob(data: IncomingProps) {
    console.log({ data })
    await this.integrationQueue.add('incoming', data, {
      attempts: data.retries,
      timeout: 10000,
      priority: 1
    });
  }

  async checkChidren(data: any) {
    await this.integrationQueue.add('check-children', data);
  }
}
