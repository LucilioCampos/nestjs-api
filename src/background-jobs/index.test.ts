import crypto from 'crypto';

import { Inject, Injectable } from '@nestjs/common';
import { bullForTesting } from 'src/testing/bull-for-testing';
import {
  backgroundJobsGenerator,
  IBackgroundJobConsumer,
  IBackgroundJobProducer,
} from './';
import { Test } from '@nestjs/testing';

const { Module, CONSUMER_TOKEN, PRODUCER_TOKEN } = backgroundJobsGenerator({
  queueName: 'teste',
  concurrency: 1,
});

type Data = {
  foo: string;
  bar: number;
};

type CompleteData = {
  key: string;
  data: Data;
};

function randomKey() {
  return crypto.randomBytes(20).toString('hex');
}

@Injectable()
class TestProvider {
  public insiderTest: Record<string, Data> = {};
  private executingPromiseResolvers: Record<string, (value: Data) => void> = {};

  constructor(
    @Inject(CONSUMER_TOKEN)
    public readonly consumer: IBackgroundJobConsumer<CompleteData>,
    @Inject(PRODUCER_TOKEN)
    public readonly producer: IBackgroundJobProducer<CompleteData>,
  ) {
    consumer._executer = this.executer.bind(this);
  }

  private async executer({ key, data }: CompleteData) {
    this.insiderTest[key] = data;
    this.jobFinished({ key, data });
  }

  private jobFinished({ key, data }: CompleteData) {
    const resolver = this.executingPromiseResolvers[key];
    if (!resolver) {
      throw new Error(
        `Job with key "${key}" not found! Data: ${JSON.stringify(data)}`,
      );
    }

    const insideData = this.insiderTest[key];

    delete this.executingPromiseResolvers[key];
    delete this.insiderTest[key];
    resolver(insideData);
  }

  public runJob(data: Data) {
    const key = `${data.foo}__${randomKey()}`;
    return new Promise<Data>((resolve) => {
      this.executingPromiseResolvers[key] = resolve;
      this.producer.addJob({ key, data });
    });
  }

  public runJobBull(data: Data) {
    const key = `${data.foo}__${randomKey()}`;
    this.executingPromiseResolvers[key] = jest.fn();
    return this.producer.addJobBull({ key, data });
  }
}

describe('background-jobs', () => {
  let provider: TestProvider;
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const tmpModule = await Test.createTestingModule({
      imports: [...bullForTesting(), Module],
      providers: [TestProvider],
    }).compile();

    await tmpModule.createNestApplication().init();

    provider = tmpModule.get(TestProvider);
  });

  it('should execute provider', () => {
    const data = { bar: 1, foo: randomKey() };
    return expect(provider.runJob(data)).resolves.toEqual(data);
  });

  it('should execute job finished handle', async () => {
    expect.assertions(2);
    const data1 = { bar: 1, foo: randomKey() };
    const data2 = { bar: 2, foo: randomKey() };

    const job1 = await provider.runJobBull(data1);
    const job2 = await provider.runJobBull(data2);
    await Promise.all([
      job1.finished().then(() => expect(1).toBeDefined()),
      job2.finished().then(() => expect(2).toBeDefined()),
    ]);
  });

  it('should alert when all jobs have finished', (done) => {
    const data1 = { bar: 1, foo: randomKey() };
    const data2 = { bar: 2, foo: randomKey() };
    provider.runJobBull(data1);
    provider.runJobBull(data2);
    provider.producer._queueFinished = () => {
      done();
    };
  });
});
