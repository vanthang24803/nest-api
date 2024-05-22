import { Matches } from 'class-validator';
import { passwordRegex } from './login.dto';

export class ResetPasswordDto {
  @Matches(passwordRegex, {
    message:
      'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and be 6 to 20 characters long',
  })
  oldPassword: string;

  @Matches(passwordRegex, {
    message:
      'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and be 6 to 20 characters long',
  })
  newPassword: string;
}
