import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';

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
  let service: BookmarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        { provide: BookmarkService, useValue: serviceMock },
      ],
    }).compile();

    service = module.get<BookmarkService>(BookmarkService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it(`should return an array of skus`, async () => {
      jest.spyOn(service, 'getFile');

      const response = await service.getFile();
      expect(response).toEqual(skus);
      expect(service.getFile).toHaveBeenCalledTimes(1);
      expect(service.getFile).toHaveBeenCalledWith();
    });
  });
});
