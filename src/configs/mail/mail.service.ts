import { TokenService } from '@/router/auth/token/token.service';
import { Actions } from '@/router/auth/types';
import { Role } from '@/entities';
import { Env } from '@/enums';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private readonly config: ConfigService,
    private readonly mailerService: MailerService,
    private readonly tokenService: TokenService,
  ) {}

  /**
   * TODO : Send Mail Method
   **/

  async sendMail(email: string, subject: string, content: string) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      html: content,
    });
  }

  /**
   * TODO : Get Url Mail Service
   **/

  async getUrlEmail(
    id: string,
    email: string,
    roles: Role[],
    actions: Actions,
  ): Promise<string> {
    const token = await this.tokenService.generateAccessToken(id, email, roles);

    const url = `${this.config.get(Env.URL)}/auth/${actions}?token=${token}`;

    return url;
  }
}
