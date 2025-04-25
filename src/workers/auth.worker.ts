import { Job } from 'bull';
import BaseWorker from './base-worker';
import prisma from '@/database';
import Container from 'typedi';
import EmailService from '@/services/email.service';
import { TokenService } from '@/services/token.service';

type JobType = 'user-signup' | 'user-login' | 'password-reset' | 'user-email-verified';
type JobData = {
  userId: string;
};

class AuthWorker extends BaseWorker<{
  action: JobType;
  data: JobData;
}> {
  constructor() {
    super('auth');
  }

  private emailService = Container.get(EmailService);
  private token = Container.get(TokenService);

  private async userSignup(data: JobData) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return;
    }

    const verifyEmailToken = await this.token.generateVerifyEmailToken(user.id);
    await this.emailService.sendVerificationEmail(user.email, verifyEmailToken);
  }
  private async userLogin(data: JobData) {
    //
  }
  private async passwordReset(data: JobData) {
    //
  }
  private async userEmailVerified(data: JobData) {
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      return;
    }
    //
  }

  async handleProcess(job: Job<{ action: JobType; data: JobData }>): Promise<void> {
    const { action, data } = job.data;

    switch (action) {
      case 'user-signup':
        await this.userSignup(data);
        break;
      case 'user-login':
        await this.userLogin(data);
        break;
      case 'password-reset':
        await this.passwordReset(data);
        break;
      case 'user-email-verified':
        await this.userEmailVerified(data);
        break;
      default:
        break;
    }
  }
}

export default new AuthWorker();
