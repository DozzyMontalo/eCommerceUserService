import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { EmailModule } from './email/email.module';
import { MessagingModule } from './messaging/messaging.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
      AuthModule,
      UserModule, 
      PrismaModule, EmailModule, MessagingModule
  ],
  
})
export class AppModule {}
