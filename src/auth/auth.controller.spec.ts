import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon from 'argon2';
import { AuthService } from './auth.service';
import { ForbiddenException } from '@nestjs/common';
import { AuthController } from './auth.controller';

jest.mock('argon2');

const fakeUser = {
  id: 7,
  email: 'lucilio.junior@keyrus.com.braasd',
  firstName: null,
  lastName: null,
  createdAt: '2023-11-06T08:02:31.335Z',
  updatedAt: '2023-11-06T08:02:31.335Z',
};

const serviceMock = {
  signup: jest.fn().mockResolvedValue(fakeUser),
};

describe('AuthService', () => {
  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: AuthService, useValue: serviceMock }],
      controllers: [AuthController],
    }).compile();

    service = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it(`should return an array of posts`, async () => {
      jest.fn().mockImplementation(controller.signup);
      const response = await controller.signup({
        email: fakeUser.email,
        password: '123',
      });
      expect(response).toEqual(fakeUser);
      expect(service.signup).toHaveBeenCalledTimes(1);
      expect(service.signup).toHaveBeenCalledWith({
        email: fakeUser.email,
        password: '123',
      });
    });
    it(`should return error without email`, async () => {
      jest
        .spyOn(controller, 'signup')
        .mockImplementationOnce(() => Promise.reject(new ForbiddenException()));

      const response = controller.signup({
        email: null,
        password: '123',
      });

      expect(response).rejects.toThrow();
      expect(response).rejects.toThrowError();
    });
  });
});
