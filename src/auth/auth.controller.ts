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
  Get,
} from '@nestjs/common';
import { LoginDto } from '@/auth/dto/login.dto';
import { RegisterDto } from '@/auth/dto/register.dto';
import { AuthService } from '@/auth/auth.service';
import { AtGuard, RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId } from './common/decorators';

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

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @GetCurrentUserId() id: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return await this.authService.refreshToken(id, refreshToken);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUserId() id: string) {
    return await this.authService.logout(id);
  }

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  roles() {
    return this.authService.getRoles();
  }
}
