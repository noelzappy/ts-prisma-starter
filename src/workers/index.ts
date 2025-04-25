// src/workers/index.ts
import 'reflect-metadata'; // for typedi
import AuthWorker from './auth.worker';
import WebhookWorker from './webhook.workers';

async function bootstrapWorkers() {
  const workers = [AuthWorker, WebhookWorker];

  for (const worker of workers) {
    await worker.process(5); // This registers the job processor
  }
}

bootstrapWorkers();
