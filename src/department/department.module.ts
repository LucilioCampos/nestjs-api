import { Module } from '@nestjs/common';
import { DeparmentService } from './department.service';
import { DeparmentController } from './department.controller';
import { JobsProducer } from 'src/jobs/producer/jobs.producer';
import { PrismaService } from '@prisma/prisma.service';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [DeparmentController],
  providers: [DeparmentService, JobsProducer, PrismaService],
  imports: [
    BullModule.registerQueue({
      name: 'jobs',
    }),
  ],
  exports: [JobsProducer],
})
export class DeparmentModule {}
