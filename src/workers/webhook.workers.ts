import { Job } from 'bull';
import BaseWorker from './base-worker';

type WebhookAction = 'webhook-one' | 'webhook-two';

class WebhookWorker extends BaseWorker<{
  action: WebhookAction;
  event: any;
}> {
  constructor() {
    super('webhooks');
  }

  async handleWebhookOne(event: any) {
    //
  }

  async handleWebhookTwo(event: any) {
    //
  }

  async handleProcess(job: Job<{ action: WebhookAction; event: any }>): Promise<void> {
    const { action, event } = job.data;
    switch (action) {
      case 'webhook-one':
        await this.handleWebhookOne(event);
        break;
      case 'webhook-two':
        await this.handleWebhookTwo(event);
        break;
      default:
        break;
    }
  }
}

export default new WebhookWorker();
