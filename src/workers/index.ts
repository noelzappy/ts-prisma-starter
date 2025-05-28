// src/workers/index.ts
import 'reflect-metadata'; // for typedi
import AuthWorker from './auth.worker';
import WebhookWorker from './webhook.workers';
import { logger } from '@/utils/logger';

async function bootstrapWorkers() {
  const workers = [AuthWorker, WebhookWorker];

  for (const worker of workers) {
    await worker.process(5); // This registers the job processor
  }
  logger.info('Workers have been initialized and are processing jobs.');
}

bootstrapWorkers();
