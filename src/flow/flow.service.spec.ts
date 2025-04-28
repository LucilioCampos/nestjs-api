import { Test, TestingModule } from '@nestjs/testing';
import { FlowService } from './flow.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('FlowService', () => {
  let flowService: FlowService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    flow: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirstOrThrow: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlowService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    flowService = module.get<FlowService>(FlowService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(flowService).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if flow data is invalid', async () => {
      const invalidData = { name: '' };

      await expect(flowService.create(invalidData as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a new flow when valid data is provided', async () => {
      const validData = {
        nickname: "Flow 1",
        slug: "flow-1",
        notificationEmail: "example@example.com",
        retries: 3,
        headers: "{\"Authorization\":\"Bearer token\"}",
      };
      const flow = { id: 1, ...validData };

      mockPrismaService.flow.create.mockResolvedValue(flow);

      expect(await flowService.create(validData)).toEqual(flow);
      expect(mockPrismaService.flow.create).toHaveBeenCalledWith({
        data: validData,
      });
    });
  });

  describe('findAll', () => {
    it('should return a list of flows with pagination info', async () => {
      const flows = [{ id: 1, name: 'Flow 1' }];
      const total = 1;

      mockPrismaService.flow.findMany.mockResolvedValue(flows);
      mockPrismaService.flow.count.mockResolvedValue(total);
      mockPrismaService.$transaction.mockResolvedValue([flows, total]);

      const result = await flowService.findAll(1, 10);

      expect(result).toEqual({
        total,
        page: 1,
        limit: 10,
        totalPages: 1,
        flows,
      });
      expect(mockPrismaService.flow.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        orderBy: { id: 'asc' },
      });
      expect(mockPrismaService.flow.count).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a flow by ID', async () => {
      const flow = { id: 1, name: 'Flow 1' };
      mockPrismaService.flow.findFirstOrThrow.mockResolvedValue(flow);

      expect(await flowService.findOne(1)).toEqual(flow);
      expect(mockPrismaService.flow.findFirstOrThrow).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('update', () => {
    it('should update a flow', async () => {
      const updateData = { name: 'Updated Flow' };
      const updatedFlow = { id: 1, name: 'Updated Flow' };

      mockPrismaService.$transaction.mockResolvedValue([null, updatedFlow]);

      const result = await flowService.update(1, updateData as any);

      expect(result).toEqual(updatedFlow);
      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.flow.findUniqueOrThrow({ where: { id: 1 } }),
        mockPrismaService.flow.update({
          where: { id: 1 },
          data: updateData,
        }),
      ]);
    });

    it('should throw error if flow update fails', async () => {
      const updateData = { name: 'Updated Flow' };

      mockPrismaService.$transaction.mockRejectedValue(new Error('Update failed'));

      await expect(flowService.update(1, updateData as any)).rejects.toThrow(
        'Update failed',
      );
    });
  });

  describe('remove', () => {
    it('should remove a flow', async () => {
      const flowToRemove = { id: 1, name: 'Flow 1' };

      mockPrismaService.$transaction.mockResolvedValue([null, flowToRemove]);

      const result = await flowService.remove(1);

      expect(result).toEqual(flowToRemove);
      expect(mockPrismaService.$transaction).toHaveBeenCalledWith([
        mockPrismaService.flow.findUniqueOrThrow({ where: { id: 1 } }),
        mockPrismaService.flow.delete({ where: { id: 1 } }),
      ]);
    });

    it('should throw error if flow removal fails', async () => {
      mockPrismaService.$transaction.mockRejectedValue(new Error('Delete failed'));

      await expect(flowService.remove(1)).rejects.toThrow('Delete failed');
    });
  });
});
