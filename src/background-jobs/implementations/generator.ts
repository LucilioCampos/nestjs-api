import consumerGenerator from './consumer-generator';
import moduleGenerator from './module-generator';
import producerGenerator from './producer-generator';

export type BackgroundJobsGeneratorParams = {
  queueName: string;
  concurrency: number;
};

export default function backgroundJobsGenerator({ queueName, concurrency }: BackgroundJobsGeneratorParams) {
  const producer = producerGenerator({ queueName });
  const consumer = consumerGenerator({ queueName, concurrency });
  const Module = moduleGenerator({ queueName, consumer, producer });

  return {
    Module,
    CONSUMER_TOKEN: consumer.provide,
    PRODUCER_TOKEN: producer.provide,
  };
}
