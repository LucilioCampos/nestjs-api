import { BullModule } from '@nestjs/bull';
import { ClassProvider, Module } from '@nestjs/common';

export type ModuleGeneratorParams = {
  queueName: string;
  consumer: ClassProvider;
  producer: ClassProvider;
};
export default function moduleGenerator({ queueName, consumer, producer }: ModuleGeneratorParams) {
  @Module({
    imports: [
      BullModule.registerQueue({
        name: queueName,
      }),
    ],
    providers: [consumer, producer],
    exports: [consumer, producer],
  })
  class BackgroundJobsModule {}

  return BackgroundJobsModule;
}
