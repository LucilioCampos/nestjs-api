import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { CreateMessageDto } from './schema';
import { BadRequestException } from '@nestjs/common';

describe('MessageController', () => {
  let messageController: MessageController;
  let messageService: MessageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    messageController = module.get<MessageController>(MessageController);
    messageService = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(messageController).toBeDefined();
  });

  describe('create', () => {
    it('should create a message', async () => {
      const createMessageDto: CreateMessageDto = {
        origin: 'Test Origin',
        body: 'Test Body',
        flowId: 1,
      };

      jest.spyOn(messageService, 'create').mockResolvedValue(createMessageDto as any);

      const result = await messageController.create(createMessageDto);
      expect(result).toEqual(createMessageDto);
      expect(messageService.create).toHaveBeenCalledWith(createMessageDto);
    });

    it('should throw BadRequestException if invalid data is passed', async () => {
      const invalidMessageDto: CreateMessageDto = {
        origin: '',
        body: '',
        flowId: 0,
      };

      jest.spyOn(messageService, 'create').mockRejectedValue(new BadRequestException('Invalid data'));

      try {
        await messageController.create(invalidMessageDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid data');
      }
    });
  });

  describe('findAll', () => {
    it('should return a list of messages with pagination', async () => {
      const messages = [{ origin: 'Test', body: 'Body', flowId: 1 }];
      const page = 1;
      const limit = 10;

      jest.spyOn(messageService, 'findAll').mockResolvedValue({
        total: 1,
        page,
        limit,
        totalPages: 1,
        messages,
      });

      const result = await messageController.findAll(String(page), String(limit));
      expect(result).toEqual({
        total: 1,
        page,
        limit,
        totalPages: 1,
        messages,
      });
      expect(messageService.findAll).toHaveBeenCalledWith(page, limit);
    });
  });

  describe('findOne', () => {
    it('should return a message by id', async () => {
      const id = '1';
      const message = { origin: 'Test', body: 'Body', flowId: 1 };
      jest.spyOn(messageService, 'findOne').mockResolvedValue(message as any);

      const result = await messageController.findOne(id);
      expect(result).toEqual(message);
      expect(messageService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw an error if message is not found', async () => {
      const id = '999';
      jest.spyOn(messageService, 'findOne').mockRejectedValue(new Error('Message not found'));

      try {
        await messageController.findOne(id);
      } catch (error) {
        expect(error.message).toBe('Message not found');
      }
    });
  });

  describe('update', () => {
    it('should update a message', async () => {
      const id = '1';
      const updateMessageDto: CreateMessageDto = { origin: 'Updated Origin', body: 'Updated Body', flowId: 2 };

      jest.spyOn(messageService, 'update').mockResolvedValue(updateMessageDto as any);

      const result = await messageController.update(id, updateMessageDto);
      expect(result).toEqual(updateMessageDto);
      expect(messageService.update).toHaveBeenCalledWith(1, updateMessageDto);
    });
  });

  describe('remove', () => {
    it('should remove a message', async () => {
      const id = '1';

      jest.spyOn(messageService, 'remove').mockResolvedValue(undefined);

      const result = await messageController.remove(id);
      expect(result).toBeUndefined();
      expect(messageService.remove).toHaveBeenCalledWith(1);
    });
  });
});
