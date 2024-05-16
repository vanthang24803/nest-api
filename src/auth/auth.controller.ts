import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { AuthService } from '@/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  async create(@Body() registerDto: RegisterDto) {
    const existEmail = await this.authService.isExistByEmail(registerDto.email);

    if (existEmail) {
      throw new HttpException('Email already exists!', HttpStatus.BAD_REQUEST);
    }

    return this.authService.register(registerDto);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const existEmail = await this.authService.isExistByEmail(loginDto.email);

    if (!existEmail) {
      throw new HttpException('Authorized!', HttpStatus.UNAUTHORIZED);
    }

    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh() {
    return 'Hello';
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async logout() {
    return 'Logout';
  }
}
