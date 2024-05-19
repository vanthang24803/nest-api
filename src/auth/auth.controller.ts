import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  HttpCode,
  UseGuards,
  Req,
  Get,
} from '@nestjs/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { AuthService } from '@/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtEnum } from '@/enums';

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

  @UseGuards(AuthGuard(JwtEnum.JWT_REFRESH))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Req() req: Request) {
    const user = req.user;
    return await this.authService.refreshToken(
      user['sub'],
      user['refreshToken'],
    );
  }

  @UseGuards(AuthGuard(JwtEnum.JWT))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const user = req.user;
    return await this.authService.logout(user['sub']);
  }

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  roles() {
    return this.authService.getRoles();
  }
}
