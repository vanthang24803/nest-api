import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordUtils {
  public async encodePassword(password: string) {
    const SALT = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, SALT);
  }

  public async decodePassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }
}
