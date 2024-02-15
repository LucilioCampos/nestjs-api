import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';

jest.mock('argon2');

const skus = [
  '123866',
  '93288',
  '39524',
  '39320',
  '110',
  '118659',
  '43564',
  '106504',
  '272405',
  '272406',
  '272407',
];

const serviceMock = {
  getFile: jest.fn().mockResolvedValue(skus),
};

describe('BookmarkController', () => {
  let controller: BookmarkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        { provide: BookmarkService, useValue: serviceMock },
      ],
      controllers: [BookmarkController],
    }).compile();

    controller = module.get<BookmarkController>(BookmarkController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it(`should return an array of skus`, async () => {
      jest.spyOn(controller, 'getFile');

      const response = await controller.getFile();
      expect(response).toEqual(skus);
      expect(controller.getFile).toHaveBeenCalledTimes(1);
      expect(controller.getFile).toHaveBeenCalledWith();
    });
  });
});
