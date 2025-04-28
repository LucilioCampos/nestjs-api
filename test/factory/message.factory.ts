import { faker } from '@faker-js/faker';
import { PrismaTestClient } from './interfaces';
import { Prisma } from '@prisma/client';

export async function createRandomMessage(
    prismaClient: PrismaTestClient,
    overrides: Partial<Prisma.MessageUncheckedCreateInput> = {}
) {
    const data: Prisma.MessageUncheckedCreateInput = {
        body: JSON.stringify({
            test: faker.internet.domainName()
        }),
        flowId: faker.number.int(),
        origin: faker.internet.domainName(),
        ...overrides
    }
    return await prismaClient.message.create({ data })
}