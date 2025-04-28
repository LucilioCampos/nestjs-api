// jobs.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('jobs') // <- queue name
export class JobsConsumer {
  @Process('incoming')
  async incomingJob(job: Job) {
    console.log('👷 Processing job:', job.data);

    return {
      message: `Job processed with data: ${JSON.stringify(job.data)}`,
    };
  }

  @Process('children')
  async processChildren() { }
}
