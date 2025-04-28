import { Test, TestingModule } from '@nestjs/testing';
import { IntegrationService, PrivateClient, PrivateIntegrationService } from './integration.service';
import { PrismaService } from '../prisma/prisma.service';
import { IntegrationProducer } from './producer/integration.producer';
import { createRandomFlow } from '../../test/factory/flow.factory';
import { createRandomStep } from '../../test/factory/step.factory';

describe('IntegrationService', () => {
    let service: IntegrationService;
    let prisma: PrismaService;
    let producer: IntegrationProducer;
    let privateService: PrivateIntegrationService;


    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                IntegrationService,
                PrivateIntegrationService,
                PrismaService,
                IntegrationProducer,
            ],
        }).compile();

        service = module.get<IntegrationService>(IntegrationService);
        prisma = module.get<PrismaService>(PrismaService);
        producer = module.get<IntegrationProducer>(IntegrationProducer);
        privateService = module.get<PrivateIntegrationService>(PrivateIntegrationService)
    });

    describe('execute', () => {
        it('should work', async () => {
            const flow = await createRandomFlow(prisma)
            const step = await createRandomStep(prisma, { flowId: flow.id, order: 0 })
            const payload = {
                service: flow.slug,
                message: 'hello',
                other: 'value'
            };
            await service.execute(payload)

            await expect(prisma.execution.count()).resolves.toBe(1)

        })
        it('should find a flow with the service slug', async () => {
            const payload = {
                service: 'mock-service',
                message: 'hello',
                other: 'value'
            };


            await service.execute(payload);

            expect(prisma.flow.findFirstOrThrow).toHaveBeenCalledWith(expect.objectContaining({
                where: { slug: 'mock-service' },
            }));

        });

        it('should throw if flow is not found', async () => {
            jest.spyOn(privateService, 'getFlow').mockRejectedValue(new Error())
            await expect(service.execute({ service: 'unknown' })).rejects.toThrow();
        });

        it('should create a message with a valid flow', async () => {
            const mockFlowResult = {
                flowId: 1,
                stepsIds: [
                    10,
                    20
                ],
            };

            jest.spyOn(privateService, 'getFlow').mockResolvedValue(mockFlowResult);

            const payload = {
                service: 'mock-service',
                message: 'hello',
                other: 'value'
            };
            await service.execute(payload)
            const result = await privateService.getFlow(prisma as PrivateClient, 'mock-service');

            expect(result).toEqual({ flowId: 1, stepsIds: [10, 20] });
        });
    })
    it.todo('should create a job for each step')
    it.todo('should create a executions for each job')
});
