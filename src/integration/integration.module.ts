import { Module } from '@nestjs/common';
import { IntegrationService, PrivateIntegrationService } from './integration.service';
import { IntegrationController } from './integration.controller';
import { PrismaService } from '@prisma/prisma.service';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { IntegrationProducer } from './producer/integration.producer';
import { IntegrationConsumer } from './consumer/integration.cosumer';

@Module({
    controllers: [IntegrationController],

    imports: [
        BullModule.registerQueue({
            name: 'integrations',
        }),
        BullBoardModule.forFeature({
            name: 'integrations',
            adapter: BullAdapter,
        }),
    ],
    providers: [
        IntegrationService,
        PrivateIntegrationService,
        IntegrationProducer,
        IntegrationConsumer
    ],
})
export class IntegrationModule { }
