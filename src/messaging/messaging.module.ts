import { Module , OnModuleInit} from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { EmailService } from 'src/email/email.service';

@Module({
  providers: [MessagingService]
})
export class MessagingModule implements OnModuleInit {
  constructor(private messagingService: MessagingService, private emailService: EmailService) {}

  onModuleInit() {
    this.messagingService.consumeQueue((msg) => {
      const { email, username } = JSON.parse(msg.content.toString());
      this.emailService.sendWelcomeEmail(email, username);
    });
  }
}
