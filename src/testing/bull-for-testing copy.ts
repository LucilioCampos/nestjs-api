import { BullModule } from '@nestjs/bull';
import { DynamicModule } from '@nestjs/common';

export function bullForTesting(): DynamicModule[] {
  return [
    BullModule.forRoot({
      redis: {
        db: 1,
        maxRetriesPerRequest: 0,
      },
    }),
  ];
}
