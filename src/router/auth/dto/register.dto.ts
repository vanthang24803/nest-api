import { IsNotEmpty, Length } from 'class-validator';
import { LoginDto } from './login.dto';

export class RegisterDto extends LoginDto {
  @IsNotEmpty({ message: 'First Name is required' })
  @Length(1, 50, { message: 'First Name length must be between 1 and 50 characters' })
  firstName: string;

  @IsNotEmpty({ message: 'Last Name is required' })
  @Length(1, 50, { message: 'Last Name length must be between 1 and 50 characters' })
  lastName: string;

}