import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from './bull-board/bull-board.module';
import { JobsModule } from './jobs/jobs.module';
import { DeparmentModule } from './department/department.module';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { FlowModule } from './flow/flow.module';
import { IntegrationModule } from './integration/integration.module';
import { WebhooksModule } from './webhooks/webhooks.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    }),
    UsersModule,
    PrismaModule,
    BullBoardModule,
    JobsModule,
    DeparmentModule,
    AuthModule,
    MessageModule,
    FlowModule,
    IntegrationModule,
    WebhooksModule
  ],
})
export class AppModule { }
