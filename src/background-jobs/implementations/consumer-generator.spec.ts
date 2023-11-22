import { Job } from 'bull';
import consumerGenerator from './consumer-generator';

const queueName = 'teste';
const concurrency = 100;

function createConsumer() {
  const { useClass: Consumer } = consumerGenerator({ queueName, concurrency });
  return new Consumer();
}

describe('consumerGenerator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be a function', () => {
    expect(typeof consumerGenerator).toBe('function');
  });

  it('should return a consumer', () => {
    const data = consumerGenerator({ queueName, concurrency });
    expect(data.useClass).toBeDefined();
    expect(data.provide).toBeDefined();
  });
});

describe('BackgroundJobConsumer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should set _executer ', () => {
    const consumer = createConsumer();
    const fn = jest.fn();

    expect(() => (consumer._executer = fn)).not.toThrowError();
  });

  it('should assert _executer is a function', () => {
    const consumer = createConsumer();
    const fn = 'foo' as unknown as (data: unknown) => void;
    expect(() => (consumer._executer = fn)).toThrowError(/function.*string/);
  });

  it('should throw if _executer is accessed before it was set', () => {
    const consumer = createConsumer();
    expect(() => consumer._executer).toThrowError(/defined/);
  });

  it('should return seted _executer', () => {
    const consumer = createConsumer();
    const fn = jest.fn();
    consumer._executer = fn;
    expect(consumer._executer).toBe(fn);
  });

  it('should call _executer inside of execute', async () => {
    const consumer = createConsumer();
    const fn = jest.fn();
    consumer._executer = fn;

    expect(fn).not.toHaveBeenCalled();
    await consumer.execute({ data: null } as Job);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass job data to _executer', async () => {
    const consumer = createConsumer();
    const fn = jest.fn();
    const job = {
      data: [1, 2, 3],
    } as Job;
    consumer._executer = fn;

    await consumer.execute(job);
    expect(fn).toHaveBeenCalledWith(job.data);
  });
});
