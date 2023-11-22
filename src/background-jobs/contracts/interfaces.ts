import type { Job } from 'bull';

export interface IBackgroundJobConsumer<Data> {
  _executer: (data: Data) => void | Promise<void>;
}

export interface IBackgroundJobProducer<Data> {
  _queueFinished?: () => void | Promise<void>;
  addJob: (data: Data) => Promise<void>;
  addJobBull: (data: Data) => Promise<Job>;
}
