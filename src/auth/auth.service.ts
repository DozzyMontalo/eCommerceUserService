import {
    ForbiddenException,
    Injectable,
  } from '@nestjs/common';
  import { PrismaService } from '../prisma/prisma.service';
  import { AuthDto } from './dto';
  import * as argon from 'argon2';
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  import { MessagingService } from '../messaging/messaging.service';
  
  @Injectable()
  export class AuthService {
    constructor(
      private prisma: PrismaService,
      private jwt: JwtService,
      private config: ConfigService,
      private messagingService: MessagingService,
    ) {}
  
  
        async signup(dto: AuthDto) {
          // generate the password hash
          const hash = await argon.hash(dto.password);
          // save the new user in the db
          try {
            const user = await this.prisma.user.create({
              data: {
                email: dto.email,
                hash,
              },
            });
      
            // send welcome email message to the queue
            const message = JSON.stringify({ email: dto.email, username: dto.email.split('@')[0] });
            await this.messagingService.sendToQueue(message);
      
            return user;
          } catch (error) {
            throw new Error(`User with email ${dto.email} already exists`);
          }
        }
  
      
  
    async signin(dto: AuthDto) {
      // find the user by email
      const user = await this.prisma.user.findFirst({
          where: {
            email: dto.email,
          },
        });
      // if user does not exist throw exception
      if (!user)
        throw new ForbiddenException(
          'Credentials incorrect',
        );
  
      // compare password
      const pwMatches = await argon.verify(
        user.hash,
        dto.password,
      );
      // if password incorrect throw exception
      if (!pwMatches)
        throw new ForbiddenException(
          'Credentials incorrect',
        );
      return this.signToken(user.id, user.email);
    }
  
    async signToken(
      userId: number,
      email: string,
    ): Promise<{ access_token: string }> {
      const payload = {
        sub: userId,
        email,
      };
      const secret = this.config.get('JWT_SECRET');
  
      const token = await this.jwt.signAsync(
        payload,
        {
          expiresIn: '15m',
          secret: secret,
        },
      );
  
      return {
        access_token: token,
      };
    }
  }