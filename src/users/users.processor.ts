import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('users')
export class UserProcessor {
  @Process('email')
  async handleEmail(job: Job) {
    console.log('Processing job:', job.data);
    // Do email logic here...
  }
}
