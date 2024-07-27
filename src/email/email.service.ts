import { Injectable, Logger } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    const msg = {
      to,
      from: 'no-reply@yourdomain.com', // Use your verified SendGrid sender
      subject: 'Welcome to Our Service',
      text: `Hello ${username}, welcome to our service!`,
      html: `<strong>Hello ${username}, welcome to our service!</strong>`,
    };

    try {
      await sgMail.send(msg);
      this.logger.log(`Welcome email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}`, error.stack);
    }
  }
}
