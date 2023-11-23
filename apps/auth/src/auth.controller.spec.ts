import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { BadRequestException, HttpStatus } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

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
  signToken: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: AuthService, useValue: serviceMock }],
      controllers: [AuthController],
    }).compile();

    service = module.get(AuthService);
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
      const erroBody = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['email should not be empty', 'email must be an email'],
        error: 'Bad Request',
      };
      jest
        .spyOn(service, 'signup')
        .mockRejectedValueOnce(
          new BadRequestException([
            'email should not be empty',
            'email must be an email',
          ]),
        );

      try {
        await controller.signup({
          email: null,
          password: '123',
        });
      } catch (error) {
        expect(error.response).toMatchObject(erroBody);
        expect(error.status).toStrictEqual(HttpStatus.BAD_REQUEST);
      }
    });
    it(`should return error bad request if email already taken`, async () => {
      const erroBody = {
        error: 'Forbidden',
        message: 'Credentials taken',
        statusCode: HttpStatus.FORBIDDEN,
      };

      jest.spyOn(service, 'signToken').mockRejectedValueOnce(
        new PrismaClientKnownRequestError('error', {
          clientVersion: '1',
          code: '400',
        }),
      );

      try {
        await controller.signup({
          email: fakeUser.email,
          password: '123',
        });
      } catch (error) {
        expect(error.response).toMatchObject(erroBody);
        expect(error.status).toBe(HttpStatus.FORBIDDEN);
      }
    });
  });
});
