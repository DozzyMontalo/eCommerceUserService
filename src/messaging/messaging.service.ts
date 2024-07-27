import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class MessagingService implements OnModuleInit {
  private connection: amqp.Connection;
  private channel: amqp.Channel;
  private readonly logger = new Logger(MessagingService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const rabbitMqUrl = this.configService.get<string>('RABBITMQ_URL');
    try {
      this.connection = await amqp.connect(rabbitMqUrl);
      this.channel = await this.connection.createChannel();
      this.logger.log('Connected to RabbitMQ');
    } catch (error) {
      this.logger.error('Failed to connect to RabbitMQ', error.stack);
    }
  }

  async sendToQueue(message: string) {
    if (!this.channel) {
      this.logger.error('Channel is not available');
      return;
    }

    try {
      await this.channel.assertQueue('emails', { durable: true });
      this.channel.sendToQueue('emails', Buffer.from(message));
      this.logger.log('Message sent to queue');
    } catch (error) {
      this.logger.error('Failed to send message to queue', error.stack);
    }
  }

  async consumeQueue(callback: (msg: amqp.Message) => void) {
    if (!this.channel) {
      this.logger.error('Channel is not available');
      return;
    }

    try {
      await this.channel.assertQueue('emails', { durable: true });
      this.channel.consume('emails', (msg) => {
        if (msg !== null) {
          callback(msg);
          this.channel.ack(msg);
        }
      });
      this.logger.log('Consuming messages from queue');
    } catch (error) {
      this.logger.error('Failed to consume messages from queue', error.stack);
    }
  }
}
