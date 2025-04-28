import { faker } from '@faker-js/faker';
import { PrismaTestClient } from './interfaces';
import { Prisma } from '@prisma/client';

export async function createRandomStep(prismaClient: PrismaTestClient, overrides: Partial<Prisma.StepUncheckedCreateInput> = {}) {
    const data: Prisma.StepUncheckedCreateInput = {
        flowId: faker.number.int(),
        informaticaTaskFlowId: faker.string.uuid(),
        nickname: faker.company.name(),
        order: 0,
        ...overrides
    }
    return await prismaClient.step.create({ data })
}