import { InjectQueue } from '@nestjs/bull';
import { ClassProvider, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bull';
import { IBackgroundJobProducer } from '../contracts/interfaces';

export type ProducerGeneratorParams = {
  queueName: string;
};
export default function producerGenerator<Data>({
  queueName,
}: ProducerGeneratorParams): ClassProvider<IBackgroundJobProducer<Data>> {
  const provide = `BACKJOBS_PRODUCER_${queueName}`;

  class Producer implements IBackgroundJobProducer<Data>, OnModuleDestroy {
    _queueFinished?: () => void | Promise<void>;

    constructor(@InjectQueue(queueName) private readonly queue: Queue) {
      this.queue.on('drained', () => {
        this._queueFinished?.();
      });
    }

    async addJob(data?: Data) {
      await this.queue.add(data);
    }

    async addJobBull(data?: Data) {
      return this.queue.add(data);
    }

    async onModuleDestroy() {
      await this.queue.close();
    }
  }

  return {
    provide,
    useClass: Producer,
  };
}
