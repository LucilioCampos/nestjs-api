import { v4 as uuidv4 } from 'uuid';
import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import { Queue } from 'bull'; // Import Queue
import { getQueueToken } from '@nestjs/bull'; // Import getQueueToken for Bull's queue token

describe('UsersController', () => {
  let controller: UsersController;
  let services: UsersService;
  let user: User;
  let mockQueue: Queue;

  const mockUserService = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findUniqueOrThrow: jest.fn(),
    },
  };

  beforeEach(async () => {
    mockQueue = {
      add: jest.fn(), // Mock the 'add' method for the queue
    } as unknown as Queue; // Type assertion to mock Queue as the actual class

    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUserService },
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: getQueueToken('users'), useValue: mockQueue }, // Mock the 'users' queue
      ],
    }).compile();

    controller = moduleRef.get<UsersController>(UsersController);
    services = moduleRef.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('User', () => {
    beforeAll(async () => {
      user = {
        id: 1,
        username: 'John',
        createdAt: new Date(),
        updatedAt: new Date(),
        email: `${uuidv4()}@gmail.com`,
        canWrite: false,
        isAdmin: false,
      };
      mockUserService.findOne.mockResolvedValue(user);
      mockUserService.create.mockImplementation(async (args) => ({
        ...user,
        ...args,
      }));
      mockUserService.update.mockImplementation(async (id, args) => ({
        id,
        ...user,
        ...args, // Override with new values
      }));
      mockUserService.findAll.mockResolvedValue({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        users: [user],
      });
      mockUserService.remove.mockResolvedValue(undefined); // Mock remove method
    });

    it('should return the user by id', async () => {
      const result = await controller.findOne(1);
      expect(result).toEqual(user);
    });

    it('should create a user', async () => {
      const createUser = {
        username: 'John',
        email: `${uuidv4()}@gmail.com`,
        canWrite: true,
        isAdmin: true,
      };

      const result = await controller.create(createUser);
      expect(result).toMatchObject(createUser);
      expect(mockUserService.create).toHaveBeenCalledTimes(1);
    });

    it('should not create a user with a invalid deparmetments', async () => {
      const createUser = {
        username: 'test',
        email: `${uuidv4()}@test.com`,
        canWrite: true,
        isAdmin: true,
        departmentIds: [0]
      };

      const result = await controller.create(createUser);
      expect(result).toMatchObject(createUser);
    })

    it('should update a user', async () => {
      const updateUser = {
        username: 'John',
        email: `${uuidv4()}@hotmail.com`,
        canWrite: true,
        isAdmin: true,
      };

      const result = await controller.update('1', updateUser);
      expect(result).toMatchObject(updateUser);
      expect(mockUserService.update).toHaveBeenCalledTimes(1);
    });

    it('should delete a user', async () => {
      const result = await controller.remove('1');
      expect(result).toBeUndefined(); // Ensure the result is undefined if the remove is successful
      expect(mockUserService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
