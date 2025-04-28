import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { JobsProducer } from 'src/jobs/producer/jobs.producer';
import { PrismaService } from '@prisma/prisma.service';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [MessageController],
  providers: [MessageService, JobsProducer, PrismaService],
  exports: [JobsProducer],
  imports: [
    BullModule.registerQueue({
      name: 'jobs',
    }),
  ],
})
export class MessageModule { }
