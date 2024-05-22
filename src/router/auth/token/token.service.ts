import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RoleService } from '../role/role.service';
import { Role } from '@/entities';
import { JwtPayload, Token } from '../types';
import { Env } from '@/enums';

@Injectable()
export class TokenService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly roleService: RoleService,
  ) {}

  /**
   * TODO : Generate Access Token
   **/

  async generateAccessToken(
    id: string,
    email: string,
    roles: Role[],
  ): Promise<string> {
    const hashRoles = this.roleService.getNameRole(roles);

    const jwtPayload: JwtPayload = {
      email,
      sub: id,
      roles: hashRoles,
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('SECRET'),
      expiresIn: '15m',
    });

    return token;
  }

  /**
   * TODO : Decode Payload JWT Token
   **/

  async decodeToken(token: string): Promise<string> {
    const payload = await this.jwtService.decode(token);

    if (payload?.exp < Date.now() / 1000) {
      throw new UnauthorizedException('Tokens expired!');
    }

    return payload?.sub;
  }

  /**
   * TODO : Generate Tokens
   **/

  async generateTokens(
    id: string,
    email: string,
    roles: Role[],
  ): Promise<Token> {
    const hashRoles = this.roleService.getNameRole(roles);

    const jwtPayload: JwtPayload = {
      email,
      sub: id,
      roles: hashRoles,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>(Env.SECRET),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>(Env.REFRESH),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
