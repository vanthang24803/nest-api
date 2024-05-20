import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  HttpCode,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  RegisterDto,
  LoginDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from '@/auth/dto';
import { AuthService } from '@/auth/auth.service';
import { AtGuard, RtGuard } from './common/guards';
import { GetCurrentUser, GetCurrentUserId, Roles } from './common/decorators';
import { RolesGuard } from './common/guards/roles.guard';
import { RoleEnum as Role } from '@/enums';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(RtGuard, RolesGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() id: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshToken(id, refreshToken);
  }

  @UseGuards(AtGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() id: string) {
    return this.authService.logout(id);
  }

  @Get('roles')
  @HttpCode(HttpStatus.OK)
  roles() {
    return this.authService.getRoles();
  }

  @Post('manager')
  @UseGuards(AtGuard)
  @Roles(Role.USER)
  @HttpCode(HttpStatus.OK)
  upgradeManager(@GetCurrentUserId() id: string) {
    return this.authService.upgradeRole(id, Role.MANAGER);
  }

  @Post('admin')
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  upgradeAdmin(@GetCurrentUserId() id: string) {
    return this.authService.upgradeRole(id, Role.ADMIN);
  }

  @Get('verify-email')
  @HttpCode(HttpStatus.OK)
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  forgotPassword(@Body() forgotPassword: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPassword.email);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Query('token') token: string,
    @Body() resetPassword: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(token, resetPassword);
  }

  @Post('avatar')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @GetCurrentUserId() id: string,
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.authService.uploadAvatar(id, file);
  }

  @Get('profile')
  @UseGuards(AtGuard)
  getProfile(@GetCurrentUserId() id: string) {
    return this.authService.getProfile(id);
  }

  @Post('profile')
  @UseGuards(AtGuard)
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @GetCurrentUserId() id: string,
    @Body() updateProfile: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(id, updateProfile);
  }
}
