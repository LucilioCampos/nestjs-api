import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from '@prisma/client';

const fakeUser = {
  id: 1,
  email: 'lucilio.junior@keyrus.com.br',
  firstName: null,
  lastName: null,
  createdAt: '2023-11-06T14:53:35.014Z',
  updatedAt: '2023-11-06T14:53:35.014Z',
};

describe('JwtStrategy', () => {
  let service: JwtStrategy;
  let prisma: PrismaService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy, ConfigService, PrismaService],
    }).compile();

    service = module.get<JwtStrategy>(JwtStrategy);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Valid User', async () => {
    const payload = {
      sub: 1,
      email: fakeUser.email,
    };

    jest.spyOn(service, 'validate');
    jest
      .spyOn(prisma.user, 'findFirst')
      .mockResolvedValue(fakeUser as unknown as User);
    const validate = await service.validate(payload);

    expect(service.validate).toHaveBeenCalledTimes(1);
    expect(service.validate).toBeCalledWith(payload);
    expect(validate).toMatchObject(fakeUser);
  });

  it('Invalid User', async () => {
    const payload = {
      sub: 2,
      email: 'lucilio@codeby.com.br',
    };

    jest.spyOn(service, 'validate');
    const validate = await service.validate(payload);

    expect(service.validate).toHaveBeenCalledTimes(1);
    expect(service.validate).toBeCalledWith(payload);
    expect(validate).toBe(null);
  });
});
