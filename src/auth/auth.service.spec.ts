import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

jest.mock('argon2', () => {
  const originalModule = jest.requireActual('argon2');

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    hash: () => 'mocked foo',
  };
});

const fakeUser = {
  id: 1,
  email: 'lucilio.junior@keyrus.com.br',
  firstName: null,
  lastName: null,
  createdAt: '2023-11-06T14:53:35.014Z',
  updatedAt: '2023-11-06T14:53:35.014Z',
};

const prismaMock = {
  user: {
    create: jest.fn().mockReturnValue({}),
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        PrismaService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it(`should return signup user data`, async () => {
      const access_token = 'foo';
      jest.spyOn(service, 'signToken').mockResolvedValue({ access_token });
      const response = await service.signup({
        email: fakeUser.email,
        password: '123',
      });

      expect(response).toEqual({ access_token });
      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'lucilio.junior@keyrus.com.br',
          hash: 'mocked foo',
        },
      });
    });
    it(`should return error without email`, async () => {
      jest
        .spyOn(service, 'signup')
        .mockImplementationOnce(() => Promise.reject(new ForbiddenException()));

      const response = service.signup({
        email: null,
        password: '123',
      });

      expect(response).rejects.toThrow();
      expect(response).rejects.toThrowError();
    });
  });
});
