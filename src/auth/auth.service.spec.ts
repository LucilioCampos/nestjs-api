import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IAuthService } from './contracts';
import { ForbiddenException } from '@nestjs/common';
import { PrismaClientKnownRequestError as KnowError } from '@prisma/client/runtime/library';
import { AuthGatewayTest } from './implementations/auth.gateway-test';
import { AUTH_SERVICE_TOKEN } from './contracts/tokens';

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        ConfigService,
        PrismaService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: AUTH_SERVICE_TOKEN, useClass: AuthGatewayTest },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it(`should return signup user data`, async () => {
      const access_token = `${fakeUser.id}${fakeUser.email}`;
      const response = await service.signup({
        email: fakeUser.email,
        password: fakeUser.password,
      });
      expect(response).toEqual({ access_token });
    });
    it(`should return error if user already exists`, async () => {
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
      const response = service.signup({
        email: fakeUser.email,
        password: null,
      });

      expect(response).rejects.toThrowError(
        new ForbiddenException('Credentials incorrect!'),
      );
    });

    it(`should return error without email`, async () => {
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
      jest.spyOn(service, 'signToken');

      await service.signup({
        email: fakeUser.email,
        password: fakeUser.password,
      });

      // expect(service.signToken).toBeCalledTimes(1);

      const token = await service.signin({
        email: fakeUser.email,
        password: fakeUser.password,
      });

      // expect(service.signToken).toBeCalledTimes(2);
      expect(token).toStrictEqual({
        access_token: `${fakeUser.id}${fakeUser.email}`,
      });
    });
    it('should throw error if email not exists', async () => {
      try {
        await service.signin({
          email: 'lucci@lucci.com',
          password: '123',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });

    it('should throw error if password dont match not exists', async () => {
      try {
        await service.signin({
          email: 'lucci@lucci.com',
          password: null,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ForbiddenException);
      }
    });
  });
});
