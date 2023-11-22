import consumerGenerator from './consumer-generator';
import { IBackgroundJobProducer } from '../contracts/interfaces';
import moduleGenerator from './module-generator';
import producerGenerator from './producer-generator';
import { Test } from '@nestjs/testing';

function createModule() {
  const queueName = 'test';
  const consumer = consumerGenerator({ queueName, concurrency: 10 });
  const producer = producerGenerator({ queueName });

  return {
    module: moduleGenerator({ queueName, consumer, producer }),
    producer,
  };
}

describe('moduleGenerator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be a function', () => {
    expect(typeof moduleGenerator).toBe('function');
  });

  it('should return a module', () => {
    expect(createModule().module).toBeDefined();
  });

  it('should return a producer', () => {
    expect(createModule().producer).toBeDefined();
  });
});

describe('BackgroundJobsModule', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should export producer', async () => {
    const { module, producer } = createModule();
    const testModule = await Test.createTestingModule({
      imports: [module],
    }).compile();
    const testProducer = testModule.get<
      IBackgroundJobProducer<{ foo: string }>
    >(producer.provide);
    expect(testProducer).toBeDefined();
    expect(testProducer.addJob).toBeDefined();
  });
});
