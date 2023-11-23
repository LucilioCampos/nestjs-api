import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthService } from './contracts';
import { ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError as KnowError } from '@prisma/client/runtime/library';

jest.mock('argon2', () => {
  const originalModule = jest.requireActual('argon2');

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'mocked baz'),
    hash: () => 'mocked foo',
    verify: (..._args) => 'mocked bar',
  };
});

const fakeUser = {
  id: 1,
  email: 'lucilio.junior@keyrus.com.br',
  password: '123',
  firstName: null,
  lastName: null,
  createdAt: '2023-11-06T14:53:35.014Z',
  updatedAt: '2023-11-06T14:53:35.014Z',
};

const prismaMock = {
  user: {
    findFirst: jest.fn().mockResolvedValue(fakeUser),
    findUnique: jest.fn().mockResolvedValue(fakeUser),
    create: jest.fn().mockResolvedValue(fakeUser),
  },
};

describe('AuthService', () => {
  let service: IAuthService;
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

    service = module.get(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it(`should return signup user data`, async () => {
      const access_token = 'foo';
      jest.spyOn(service, 'signToken').mockResolvedValueOnce({ access_token });
      jest.spyOn(prisma.user, 'create');
      const response = await service.signup({
        email: fakeUser.email,
        password: fakeUser.password,
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
    it(`should return error if user already exists`, async () => {
      const knowError = new KnowError('error', {
        clientVersion: '1',
        code: 'P2002',
      });

      jest.spyOn(prisma.user, 'create').mockRejectedValueOnce(knowError);
      expect(prisma.user.create).rejects.toThrowError(knowError);
      jest.spyOn(service, 'signup');
      jest.spyOn(service, 'signToken');
      try {
        await service.signup({
          email: fakeUser.email,
          password: fakeUser.password,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
        expect(error.response.message).toStrictEqual('Credentials taken');
        expect(service.signup).toBeCalledTimes(1);
        expect(service.signup).toBeCalledWith({
          email: fakeUser.email,
          password: fakeUser.password,
        });
        expect(service.signToken).not.toBeCalled();
      }
    });

    it(`should return error without password`, async () => {
      jest
        .spyOn(service, 'signup')
        .mockRejectedValueOnce(
          new ForbiddenException('Credentials incorrect!'),
        );
      const response = service.signup({
        email: fakeUser.email,
        password: null,
      });

      expect(response).rejects.toThrowError(
        new ForbiddenException('Credentials incorrect!'),
      );
    });

    it(`should return error without email`, async () => {
      jest.spyOn(service, 'signup');
      jest
        .spyOn(prisma.user, 'create')
        .mockRejectedValueOnce(
          new ForbiddenException('Credentials incorrect!'),
        );
      const response = service.signup({
        email: null,
        password: 'null',
      });

      expect(response).rejects.toThrowError(
        new ForbiddenException('Credentials incorrect!'),
      );
    });
  });

  describe('signin', () => {
    it('should login with right credentials', async () => {
      jest.spyOn(prisma.user, 'create');
      jest
        .spyOn(service, 'signToken')
        .mockResolvedValue({ access_token: 'resolved' });
      jest.spyOn(prisma.user, 'findUnique');
      await service.signup({
        email: fakeUser.email,
        password: fakeUser.password,
      });

      expect(service.signToken).toBeCalledTimes(1);

      const token = await service.signin({
        email: fakeUser.email,
        password: fakeUser.password,
      });

      expect(service.signToken).toBeCalledTimes(2);
      expect(prisma.user.findUnique).toBeCalledWith({
        where: {
          email: fakeUser.email,
        },
      });
      expect(token).toStrictEqual({ access_token: 'resolved' });
    });
    it('should throw error if email not exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      const sign = service.signin({
        email: 'lucci@lucci.com',
        password: '123',
      });
      expect(sign).rejects.toThrowError(
        new ForbiddenException('Credentials incorrect!'),
      );
    });

    it('should throw error if password dont match not exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);
      const sign = service.signin({
        email: 'lucci@lucci.com',
        password: null,
      });
      expect(sign).rejects.toThrowError(
        new ForbiddenException('Credentials incorrect!'),
      );
    });
  });
});
