import { Module } from '@nestjs/common';
import { FlowService } from './flow.service';
import { FlowController } from './flow.controller';
import { JobsProducer } from 'src/jobs/producer/jobs.producer';
import { PrismaService } from '../prisma/prisma.service';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [FlowController],
  providers: [FlowService, JobsProducer, PrismaService],

  imports: [
    BullModule.registerQueue({
      name: 'jobs',
    }),
  ],
  exports: [JobsProducer],
})
export class FlowModule { }
