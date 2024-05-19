import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '@/auth/auth.module';
import { DatabaseModule } from '@/database/database.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    MailModule,
  ],
})
export class AppModule {}
