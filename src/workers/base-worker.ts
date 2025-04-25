import { Job, JobOptions, Queue } from 'bull';
import { logger } from '@/utils/logger';
import bullQ from '@/config/bull.config';

export class BaseWorker<D> {
  private queue: Queue;

  constructor(queueName: string) {
    this.queue = bullQ(`gg-${queueName}`);
    this.setupListeners();
  }

  public async add(data: D, options: JobOptions = {}) {
    const job = await this.queue.add(data, {
      ...options,
    });
    return job;
  }

  async process(concurrency = 3) {
    this.queue.process(concurrency, this.handleProcess.bind(this));
  }

  async handleProcess(job: Job<D>) {
    throw new Error('handleProcess must be implemented by child class');
  }

  setupListeners() {
    this.queue.on('error', this.handleError.bind(this));
    this.queue.on('failed', this.handleFailure.bind(this));
    this.queue.on('completed', this.handleComplete.bind(this));
  }

  handleError(error) {
    logger.error(`Error in queue ${this.queue.name}:`, error);
  }

  handleFailure(job, error) {
    logger.error(`Job ${job.id} failed:`, error);
  }

  handleComplete(job, result) {
    logger.info(`Job ${job.id} completed with result:`, result);
  }

  getQueue() {
    return this.queue;
  }
}

export default BaseWorker;
