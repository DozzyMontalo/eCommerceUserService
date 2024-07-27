import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';

@Injectable()
export class MessagingService implements OnModuleInit {
  private readonly logger = new Logger(MessagingService.name);
  private channel: Channel;

  async onModuleInit() {
    try {
      const connection: Connection = await connect(process.env.RABBITMQ_URL);
      this.channel = await connection.createChannel();
      await this.channel.assertQueue('emailQueue', { durable: true });
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error.stack);
    }
  }

  async sendToQueue(message: string) {
    if (!this.channel) {
      this.logger.error('Channel is not available');
      return;
    }
    this.channel.sendToQueue('emailQueue', Buffer.from(message), { persistent: true });
    this.logger.log('Message sent to emailQueue');
  }

  async consumeQueue(callback: (msg: any) => void) {
    if (!this.channel) {
      this.logger.error('Channel is not available');
      return;
    }
    this.channel.consume('emailQueue', (msg) => {
      if (msg !== null) {
        callback(msg);
        this.channel.ack(msg);
      }
    });
  }
}
