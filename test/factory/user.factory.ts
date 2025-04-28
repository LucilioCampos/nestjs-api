import { faker } from '@faker-js/faker';
import { CreateUserDto } from 'src/users/schema';
import { PrismaTestClient } from './interfaces';

export function createRandomUser(prismaClient: PrismaTestClient, overrides: Partial<CreateUserDto> = {}) {
    return {
        username: faker.internet.username(),
        email: faker.image.avatar(),
        isAdmin: faker.internet.password(),
        canWrite: faker.date.birthdate(),
        ...overrides
    };
}