import { Queue } from 'bull';
import producerGenerator from './producer-generator';

const queueName = 'test';

function createProducer<Data = unknown>() {
  const { useClass: Producer } = producerGenerator<Data>({ queueName });
  const queue = { add: jest.fn(), on: jest.fn() } as unknown as Queue;
  const producer = new Producer(queue);
  return { producer, queue };
}

describe('produceGenerator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should be a function', () => {
    expect(typeof producerGenerator).toBe('function');
  });

  it('should return a ClassProvider', () => {
    const provider = producerGenerator({ queueName });
    expect(typeof provider.provide).toBe('string');
    expect(provider.useClass).toBeDefined();
  });
});

describe('BackgroundJobProducer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should add job to queue', () => {
    const { producer, queue } = createProducer();
    producer.addJob({});
    expect(queue.add).toHaveBeenCalledTimes(1);
  });

  it('should pass data for queue', () => {
    const { producer, queue } = createProducer<{ foo: string }>();
    const data = { foo: 'bar' };
    producer.addJob(data);
    expect(queue.add).toHaveBeenCalledWith(data);
  });
});
