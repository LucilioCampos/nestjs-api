import { ClassProvider } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { IBackgroundJobConsumer } from '../contracts/interfaces';

export type ConsumerGeneratorParams = {
  queueName: string;
  concurrency: number;
};
export default function consumerGenerator<Data>({ queueName, concurrency }: ConsumerGeneratorParams): ClassProvider {
  type Exec = IBackgroundJobConsumer<Data>['_executer'];

  const provide = `BACKJOBS_CONSUMER_${queueName}`;

  @Processor(queueName)
  class Consumer implements IBackgroundJobConsumer<Data> {
    #_executer?: Exec;
    public set _executer(value: Exec) {
      if (typeof value !== 'function') {
        throw new Error(`BackgroundJobConsumer#_executer should be a function, '${typeof value}' was found.`);
      }
      this.#_executer = value;
    }

    public get _executer(): Exec {
      if (!this.#_executer) {
        throw new Error("BackgroundJobConsumer#_executer isn't defined!");
      }
      return this.#_executer;
    }

    @Process({
      concurrency,
    })
    async execute(job: Job<Data>) {
      const data = job.data;
      await this._executer(data);
    }
  }

  return {
    provide,
    useClass: Consumer,
  };
}
