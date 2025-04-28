import { Test, TestingModule } from '@nestjs/testing';
import { DeparmentService } from './department.service';
import { PrismaService } from '../prisma/prisma.service';
import { JobsProducer } from 'src/jobs/producer/jobs.producer';

describe('DeparmentService', () => {
  let deparmentService: DeparmentService;
  let prismaService: PrismaService;

  // Mocking PrismaService
  const mockPrismaService = {
    department: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirstOrThrow: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn()
    },
    user: {
      count: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeparmentService,
        { provide: PrismaService, useValue: mockPrismaService }
      ],
    }).compile();

    deparmentService = module.get<DeparmentService>(DeparmentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(deparmentService).toBeDefined();
  });

  describe('create', () => {
    it('should create a department', async () => {
      const createDepartmentDto = { name: 'Engineering' };
      const department = { id: 1, name: 'Engineering' };

      mockPrismaService.department.create.mockResolvedValue(department);

      const result = await deparmentService.create(createDepartmentDto);
      expect(result).toEqual(department);
      expect(mockPrismaService.department.create).toHaveBeenCalledWith({
        data: createDepartmentDto,
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of departments with pagination', async () => {
      const departments = [{ id: 1, name: 'Engineering' }];
      const totalUsers = 5;

      mockPrismaService.department.findMany.mockResolvedValue(departments);
      mockPrismaService.user.count.mockResolvedValue(totalUsers);

      const result = await deparmentService.findAll(1, 10);
      expect(result).toEqual({
        total: totalUsers,
        page: 1,
        limit: 10,
        totalPages: 1,
        department: departments,
      });
      expect(mockPrismaService.department.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a department by ID', async () => {
      const department = { id: 1, name: 'Engineering' };
      mockPrismaService.department.findFirstOrThrow.mockResolvedValue(department);

      const result = await deparmentService.findOne(1);
      expect(result).toEqual(department);
      expect(mockPrismaService.department.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a department', async () => {
      const updateDepartmentDto = { name: 'HR' };
      const department = { id: 1, name: 'HR' };

      mockPrismaService.department.findFirst.mockResolvedValue({ id: 1, name: 'Engineering' });
      mockPrismaService.department.update.mockResolvedValue(department);
      mockPrismaService.$transaction.mockResolvedValue([
        { id: 1, name: 'Engineering' }, // The result of the findFirst
        department, // The updated department
      ]);

      const result = await deparmentService.update(1, updateDepartmentDto);
      expect(result).toEqual(department);
      expect(mockPrismaService.department.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateDepartmentDto,
      });
    });
  });

  describe('remove', () => {
    it('should return a removal message', async () => {
      const result = await deparmentService.remove(1);
      expect(result).toBe('This action removes a #1 deparment');
    });
  });

  describe('findUsers', () => {
    it('should return users in a department', async () => {
      const users = [{ id: 1, username: 'john' }];
      mockPrismaService.department.findUnique.mockResolvedValue({
        users,
      });

      const result = await deparmentService.findUsers(1);
      expect(result).toEqual(users);
      expect(mockPrismaService.department.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { users: { take: 10 } },
      });
    });
  });
});
