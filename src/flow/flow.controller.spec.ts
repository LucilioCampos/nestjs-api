import { Test, TestingModule } from '@nestjs/testing';
import { FlowController } from './flow.controller';
import { FlowService } from './flow.service';
import { CreateFlowDto, UpdateFlowDto } from './schema';

describe('FlowController', () => {
  let controller: FlowController;
  let service: FlowService;

  const mockFlowService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlowController],
      providers: [
        { provide: FlowService, useValue: mockFlowService },
      ],
    }).compile();

    controller = module.get<FlowController>(FlowController);
    service = module.get<FlowService>(FlowService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call flowService.create with the correct parameters', async () => {
      const createFlowDto: CreateFlowDto = {
        nickname: 'Flow 1',
        notification_mail: 'test@example.com',
        retries: 3,
      } as any;
      mockFlowService.create.mockResolvedValue(createFlowDto);

      const result = await controller.create(createFlowDto);
      expect(result).toEqual(createFlowDto);
      expect(mockFlowService.create).toHaveBeenCalledWith(createFlowDto);
    });
  });

  describe('findAll', () => {
    it('should call flowService.findAll and return the correct result', async () => {
      const result = { total: 1, page: 1, limit: 10, totalPages: 1, flows: [] };
      mockFlowService.findAll.mockResolvedValue(result);

      const flows = await controller.findAll();
      expect(flows).toEqual(result);
      expect(mockFlowService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call flowService.findOne with the correct id and return the result', async () => {
      const result = { id: 1, nickname: 'Flow 1' };
      mockFlowService.findOne.mockResolvedValue(result);

      const flow = await controller.findOne('1');
      expect(flow).toEqual(result);
      expect(mockFlowService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should call flowService.update with the correct parameters and return the updated flow', async () => {
      const updateFlowDto: UpdateFlowDto = { nickname: 'Updated Flow' } as any;
      const result = { id: 1, ...updateFlowDto };
      mockFlowService.update.mockResolvedValue(result);

      const updatedFlow = await controller.update('1', updateFlowDto);
      expect(updatedFlow).toEqual(result);
      expect(mockFlowService.update).toHaveBeenCalledWith(1, updateFlowDto);
    });
  });

  describe('remove', () => {
    it('should call flowService.remove with the correct id and return the removed flow', async () => {
      const result = { id: 1, nickname: 'Flow 1' };
      mockFlowService.remove.mockResolvedValue(result);

      const removedFlow = await controller.remove('1');
      expect(removedFlow).toEqual(result);
      expect(mockFlowService.remove).toHaveBeenCalledWith(1);
    });
  });
});
