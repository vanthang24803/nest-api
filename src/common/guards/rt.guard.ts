import { JwtEnum } from '@/enums';
import { AuthGuard } from '@nestjs/passport';

export class RtGuard extends AuthGuard(JwtEnum.JWT_REFRESH) {
  constructor() {
    super();
  }
}
