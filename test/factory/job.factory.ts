import { faker } from '@faker-js/faker';
import { PrismaTestClient } from './interfaces';
import { Prisma } from '@prisma/client';

export async function createRandomJob(
    prismaClient: PrismaTestClient,
    overrides: Partial<Prisma.JobUncheckedCreateInput> = {}
) {
    const data: Prisma.JobUncheckedCreateInput = {
        messageId: faker.number.int(),
        stepId: faker.number.int(),
        id: faker.number.int(),
        ...overrides
    }
    return await prismaClient.job.create({ data })
}