import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { JobsProducer } from './producer/jobs.producer';
import { JobsConsumer } from './consumer/jobs.cosumer';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'jobs',
    }),
    BullBoardModule.forFeature({
      name: 'jobs',
      adapter: BullAdapter,
    }),
  ],
  exports: [JobsProducer],
  controllers: [JobsController],
  providers: [JobsService, JobsConsumer, JobsProducer],
})
export class JobsModule { }
