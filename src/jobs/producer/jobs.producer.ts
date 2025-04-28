// jobs.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue, Job } from 'bull';

@Injectable()
export class JobsProducer implements OnModuleInit {
  constructor(@InjectQueue('jobs') private readonly myQueue: Queue) {}

  onModuleInit() {
    this.myQueue.on('completed', (job: Job, result: any) => {
      console.log(`✅ Job ${job.id} completed with result:`, result);
    });

    this.myQueue.on('failed', (job: Job, error: Error) => {
      console.error(`❌ Job ${job.id} failed:`, error.message);
    });

    this.myQueue.on('active', (job: Job) => {
      console.log(`🏃 Job ${job.id} is now active`);
    });

    this.myQueue.on('waiting', (jobId: string | number) => {
      console.log(`⏳ Job ${jobId} is waiting`);
    });

    this.myQueue.on('stalled', (job: Job) => {
      console.warn(`⚠️ Job ${job.id} stalled`);
    });
  }

  async incomingJob(data: any) {
    await this.myQueue.add('incoming', data);
  }

  async checkChidren(data: any) {
    await this.myQueue.add('check-children', data);
  }
}
