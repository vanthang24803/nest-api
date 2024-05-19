import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail(undefined, { message: 'Email must be a valid email address' })
  email: string;
}
