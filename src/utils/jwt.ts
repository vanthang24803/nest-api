import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtUtils {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.accessSecret = this.configService.get<string>('SECRET');
    this.refreshSecret = this.configService.get<string>('REFRESH');
  }

  generateAccessToken(data: object, expires: string): string {
    if (!this.accessSecret) {
      throw new Error('Access secret is not defined');
    }

    return jwt.sign({ data }, this.accessSecret, {
      expiresIn: expires,
    });
  }

  generateRefreshToken(data: object, expires: string): string {
    if (!this.refreshSecret) {
      throw new Error('Refresh secret is not defined');
    }

    return jwt.sign({ data }, this.refreshSecret, {
      expiresIn: expires,
    });
  }

  verifyAccessToken(token: string) {
    const decoded = jwt.verify(token, this.accessSecret!) as jwt.JwtPayload;
    return decoded;
  }

  verifyRefreshToken(token: string) {
    const decoded = jwt.verify(token, this.refreshSecret!) as jwt.JwtPayload;
    return decoded;
  }
}
