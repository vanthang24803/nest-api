import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Env } from '@/enums';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get(Env.MAIL_HOST),
          port: config.get(Env.MAIL_PORT),
          secure: false,
          auth: {
            user: config.get(Env.MAIL_USER),
            pass: config.get(Env.MAIL_PASS),
          },
        },
        template: {
          dir: join(__dirname, '/src/templates'),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MailModule {}
