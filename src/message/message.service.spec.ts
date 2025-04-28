import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { PrismaService } from '../prisma/prisma.service';
import { JobsProducer } from 'src/jobs/producer/jobs.producer';
import { BadRequestException } from '@nestjs/common';
import { CreateMessageDto } from './schema';

describe('MessageService', () => {
  let service: MessageService;
  let prisma: PrismaService;
  let jobsProducer: JobsProducer;

  const mockMessage = {
    id: 1,
    origin: 'source-system',
    body: 'sample body',
    headers: JSON.stringify({ foo: 'bar' }),
    flowId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    message: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      findFirstOrThrow: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockJobsProducer = {
    incomingJob: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JobsProducer, useValue: mockJobsProducer },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    prisma = module.get<PrismaService>(PrismaService);
    jobsProducer = module.get<JobsProducer>(JobsProducer);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a message and queue a job', async () => {
      const dto: CreateMessageDto = {
        origin: 'origin',
        body: 'body',
        headers: '{}',
        flowId: 1,
      };
      mockPrismaService.message.create.mockResolvedValue(mockMessage);

      const result = await service.create(dto);

      expect(result).toEqual(mockMessage);
      expect(mockPrismaService.message.create).toHaveBeenCalled();
      expect(mockJobsProducer.incomingJob).toHaveBeenCalledWith(mockMessage);
    });

    it('should throw BadRequestException for invalid schema', async () => {
      const dto: any = {
        flowId: 1,
      };

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated list of messages', async () => {
      mockPrismaService.$transaction.mockResolvedValue([[mockMessage], 1]);

      const result = await service.findAll(1, 10);
      expect(result).toEqual({
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
        messages: [mockMessage],
      });
    });
  });

  describe('findOne', () => {
    it('should return a message by id', async () => {
      mockPrismaService.message.findFirstOrThrow.mockResolvedValue(mockMessage);

      const result = await service.findOne(1);
      expect(result).toEqual(mockMessage);
    });
  });

  describe('update', () => {
    it('should update and return a message', async () => {
      mockPrismaService.message.findFirst.mockResolvedValue(mockMessage);
      mockPrismaService.message.update.mockResolvedValue({
        ...mockMessage,
        body: 'updated body',
      });
      mockPrismaService.$transaction.mockImplementation(
        async ([find, update]) => [await find, await update],
      );

      const updated = await service.update(1, {
        origin: 'origin',
        body: 'updated body',
        headers: '{}',
        flowId: 1,
      });

      expect(updated.body).toBe('updated body');
    });
  });

  describe('remove', () => {
    it('should remove a message', async () => {
      mockPrismaService.message.findFirstOrThrow.mockResolvedValue(mockMessage);
      mockPrismaService.message.delete.mockResolvedValue(mockMessage);
      mockPrismaService.$transaction.mockImplementation(
        async ([find, remove]) => [await find, await remove],
      );

      const result = await service.remove(1);
      expect(result[1]).toEqual(mockMessage);
    });
  });
});
