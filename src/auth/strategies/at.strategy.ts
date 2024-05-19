import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../types';
import { Env, JwtEnum } from '@/enums';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, JwtEnum.JWT) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>(Env.SECRET),
    });
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
