import { BullAdapter } from '@bull-board/api/bullAdapter';
import AuthWorker from './auth.worker';
import WebhookWorker from './webhook.workers';

const bullQueues = [new BullAdapter(AuthWorker.getQueue()), new BullAdapter(WebhookWorker.getQueue())];

export default bullQueues;
