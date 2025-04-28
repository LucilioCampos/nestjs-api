import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    department: {
      findMany: jest.fn()
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto = { username: 'Tester', email: 'test@test.com' };
      const newUser = { id: 1, departments: [], ...createUserDto };

      mockPrismaService.user.create.mockResolvedValue(newUser);

      expect(service.create(createUserDto)).resolves.toMatchObject(newUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: { ...createUserDto },
        include: {
          departments: true
        }
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of users with pagination info', async () => {
      const mockUsers = [{ username: 'Tester', email: 'test@test.com' }];
      const mockTotal = 1;

      mockPrismaService.$transaction.mockResolvedValue([mockUsers, mockTotal]);
      mockPrismaService.department.findMany.mockResolvedValue([{
        name: 'dep.id',
        id: 1
      }])

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result).toEqual({
        filters: {
          accessType: [
            {
              value: true,
              title: "Admin"
            },
            {
              value: false,
              title: "User"
            }
          ],
          role: [
            {
              value: true,
              title: "Can Write"
            },
            {
              value: false,
              title: "Can Read"
            }
          ],
          departments: [
            {
              value: 1,
              title: 'dep.id'
            }
          ],
        },
        total: mockTotal,
        page: 1,
        limit: 10,
        totalPages: 1,
        users: mockUsers
      })
      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.user.findMany({
          skip: 0,
          take: 10,
          orderBy: { id: 'asc' },
        }),
        mockPrismaService.user.count(),
      ]);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const mockUser = { id: 1, username: 'Tester', email: 'test@test.com' };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = { username: 'UpdatedUser', email: 'updated@example.com' };
      const updatedUser = { id: 1, ...updateUserDto };

      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue(updatedUser);
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockPrismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          departments: true
        },
        data: {
          departments: {
            deleteMany: {},
            create: [],
          },
          ...updateUserDto
        },
      });
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const mockUser = { id: 1, username: 'Tester', email: 'test@test.com' };

      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue(mockUser);
      mockPrismaService.user.delete.mockResolvedValue(mockUser);

      const result = await service.remove(1);

      expect(result).toEqual(mockUser);
      expect(mockPrismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('getDepartmentsByUserId', () => {
    it('should return departments for a user', async () => {
      const mockDepartments = [{ id: 1, name: 'Engineering' }];
      const userId = 1;

      mockPrismaService.user.findUnique.mockResolvedValue({
        id: userId,
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        departments: mockDepartments,
      });

      const result = await service.getDepartmentsByUserId(userId);

      expect(result).toEqual(mockDepartments);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        include: { departments: { take: 10 } },
      });
    });
  });
});
