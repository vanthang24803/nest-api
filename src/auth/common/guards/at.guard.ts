import { JwtEnum } from '@/constant';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtGuard extends AuthGuard(JwtEnum.JWT) {
  constructor(private reflector: Reflector) {
    super();
  }
}
