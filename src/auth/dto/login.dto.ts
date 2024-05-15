import { IsNotEmpty, Length, IsEmail, Matches } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @Length(1, 255, {
    message: 'Email length must be between 1 and 255 characters',
  })
  @IsEmail(undefined, { message: 'Email must be a valid email address' })
  email: string;

  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/,
    {
      message:
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 digit, 1 special character, and be 6 to 20 characters long',
    },
  )
  password: string;
}
