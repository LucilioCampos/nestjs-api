import { Test, TestingModule } from '@nestjs/testing';
import { DeparmentController } from './department.controller';
import { DeparmentService } from './department.service';
import { CreateDepartmentDto, UpdateDepartmentDto } from './schema';

describe('DeparmentController', () => {
  let deparmentController: DeparmentController;
  let deparmentService: DeparmentService;

  // Mocked DeparmentService methods
  const mockDeparmentService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findUsers: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeparmentController],
      providers: [
        { provide: DeparmentService, useValue: mockDeparmentService },
      ],
    }).compile();

    deparmentController = module.get<DeparmentController>(DeparmentController);
    deparmentService = module.get<DeparmentService>(DeparmentService);
  });

  it('should be defined', () => {
    expect(deparmentController).toBeDefined();
  });

  describe('create', () => {
    it('should call DeparmentService.create and return the result', async () => {
      const createDepartmentDto: CreateDepartmentDto = {
        name: 'HR',
      };
      const result = { id: 1, ...createDepartmentDto };
      mockDeparmentService.create.mockResolvedValue(result);

      expect(await deparmentController.create(createDepartmentDto)).toEqual(result);
      expect(mockDeparmentService.create).toHaveBeenCalledWith(createDepartmentDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of departments', async () => {
      const result = [
        { id: 1, name: 'HR' },
        { id: 2, name: 'Engineering' },
      ];
      mockDeparmentService.findAll.mockResolvedValue(result);

      expect(await deparmentController.findAll()).toEqual(result);
      expect(mockDeparmentService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a department by id', async () => {
      const result = { id: 1, name: 'HR' };
      mockDeparmentService.findOne.mockResolvedValue(result);

      expect(await deparmentController.findOne('1')).toEqual(result);
      expect(mockDeparmentService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a department', async () => {
      const updateDepartmentDto: UpdateDepartmentDto = { name: 'HR' };
      const result = { id: 1, name: 'HR' };
      mockDeparmentService.update.mockResolvedValue(result);

      expect(await deparmentController.update('1', updateDepartmentDto)).toEqual(result);
      expect(mockDeparmentService.update).toHaveBeenCalledWith(1, updateDepartmentDto);
    });
  });

  describe('remove', () => {
    it('should remove a department and return a success message', async () => {
      const result = 'This action removes a #1 department';
      mockDeparmentService.remove.mockResolvedValue(result);

      expect(await deparmentController.remove('1')).toEqual(result);
      expect(mockDeparmentService.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('findUserByDeparment', () => {
    it('should return a list of users for a department', async () => {
      const users = [
        { id: 1, username: 'John Doe' },
        { id: 2, username: 'Jane Doe' },
      ];
      mockDeparmentService.findUsers.mockResolvedValue(users);

      expect(await deparmentController.findUserByDeparment('1')).toEqual(users);
      expect(mockDeparmentService.findUsers).toHaveBeenCalledWith(1);
    });
  });
});
