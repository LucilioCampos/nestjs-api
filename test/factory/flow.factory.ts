import { faker } from '@faker-js/faker';
import { PrismaTestClient } from './interfaces';
import { Prisma } from '@prisma/client';

export async function createRandomFlow(prismaClient: PrismaTestClient, overrides: Partial<Prisma.FlowUncheckedCreateInput> = {}) {
    const data: Prisma.FlowUncheckedCreateInput = {
        slug: faker.string.uuid(),
        notificationEmail: faker.internet.email(),
        retries: faker.number.int({ max: 3, min: 0 }),
        headers: '[{}]',
        nickname: faker.company.name(),
        ...overrides
    }
    return await prismaClient.flow.create({ data })
}