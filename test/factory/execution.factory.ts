import { faker } from '@faker-js/faker';
import { PrismaTestClient } from './interfaces';
import { Prisma } from '@prisma/client';

export async function createRandomExecution(
    prismaClient: PrismaTestClient,
    overrides: Partial<Prisma.ExecutionUncheckedCreateInput> = {}
) {
    const data: Prisma.ExecutionUncheckedCreateInput = {
        body: JSON.stringify({
            test: faker.internet.domainName()
        }),
        jobId: faker.number.int(),
        informaticaTaskFlowId: faker.string.uuid(),
        ...overrides
    }
    return await prismaClient.execution.create({ data })
}