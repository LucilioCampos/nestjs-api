import backgroundJobsGenerator from './generator';

describe('generator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const queueName = 'test';
  const concurrency = 10;

  it('should be a function', () => {
    expect(typeof backgroundJobsGenerator).toBe('function');
  });

  it('should generate a module', () => {
    const { Module } = backgroundJobsGenerator({ queueName, concurrency });
    expect(Module).toBeDefined();
  });

  it('should generate a producer token', () => {
    const { PRODUCER_TOKEN } = backgroundJobsGenerator({
      queueName,
      concurrency,
    });
    expect(typeof PRODUCER_TOKEN).toBe('string');
  });

  it('should generate a consumer token', () => {
    const { CONSUMER_TOKEN } = backgroundJobsGenerator({
      queueName,
      concurrency,
    });
    expect(typeof CONSUMER_TOKEN).toBe('string');
  });
});
