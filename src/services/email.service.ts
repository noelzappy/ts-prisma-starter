import { Service } from 'typedi';
import { logger } from '@/utils/logger';
import ejs from 'ejs';
import path from 'path';
import { SendMailClient } from 'zeptomail';
import { CLIENT_URL } from '@/config';

const { ZEPTO_MAIL_KEY, ZEPTO_MAIL_FROM } = process.env;

const url = 'api.zeptomail.com/';
const token = ZEPTO_MAIL_KEY;
const MAIL_FROM = ZEPTO_MAIL_FROM;

@Service()
export default class EmailService {
  public async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const templateDir = path.join(__dirname, '..', 'templates', 'email.template.ejs');
    try {
      const mailClient = new SendMailClient({ url, token });

      const _html = await ejs.renderFile(templateDir, {
        content: html,
        subject,
        year: new Date().getFullYear(),
      });

      await mailClient.sendMail({
        from: {
          name: 'Growing Gifts',
          address: MAIL_FROM,
        },
        to: [
          {
            email_address: {
              address: to,
            },
          },
        ],
        subject,
        htmlbody: _html,
      });
    } catch (error: any) {
      logger.error(`Error sending email to ${to}`);
    }
  }

  public async sendVerificationEmail(to: string, token: string): Promise<void> {
    const subject = 'Verify your email';
    const html = `<tr>
      <td style="padding: 30px 30px 20px">
          <table role="presentation" style="width: 100%; border-collapse: collapse">
            <tr>
              <td style="vertical-align: middle">
                <p style="margin: 0;">
                  <strong>Welcome to our platform!</strong>
                  <br />
                  We are excited to have you on board. To get started, please verify your email address by clicking the button below.
                </p>
              </td>
            </tr>
          </table>
<!-- CTA Buttons -->
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px; margin-top: 20px">
      <tr>
        <td style="padding: 0; text-align: center">
          <a
            href="${CLIENT_URL}/verify-email?token=${token}"
            style="
              display: inline-block;
              padding: 14px 24px;
              background-color: #5c6ac4;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
              border-radius: 4px;
            "
            >Verify Email</a
          >
        </td>
      </tr>
    </table>
    </tr>
</tr>
`;
    return this.sendEmail(to, subject, html);
  }

  public async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = 'Reset your password';
    const html = `
    <tr style="padding: 20px; margin-top:30px">
          <table role="presentation" style="width: 100%; border-collapse: collapse">
            <tr>
              <td style="vertical-align: middle">
                <p style="margin: 0;">
                  <strong>Reset your password</strong>
                  <br />
                  We received a request to reset your password. To proceed, please click the button below to reset your password.
                </p>
              </td>
            </tr>
          </table>

<!-- CTA Buttons -->
    <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px; margin-top: 20px">
      <tr>
        <td style="padding: 0; text-align: center">
          <a
            href="${CLIENT_URL}/reset-password?token=${token}"
            style="
              display: inline-block;
              padding: 14px 24px;
              background-color: #5c6ac4;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              font-size: 16px;
              border-radius: 4px;
            "
            >Reset Password</a
          >
        </td>
      </tr>
    </table>
</tr>
`;
    return this.sendEmail(to, subject, html);
  }
}
