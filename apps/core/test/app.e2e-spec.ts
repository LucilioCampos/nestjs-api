import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';
const prismaMock = {
  user: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        PrismaService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    prisma = moduleFixture.get(PrismaService);
    await app.init();
  });

  afterAll(() => {
    app.close();
  });

  it('should signup new user', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'lucci@lucci.com.br', password: '123456' })
      .expect(200)
      .expect(({ body }) => {
        expect(body.access_token).not.toBeNull();
        expect(typeof body.access_token).toBe('string');
      });
  });
});
