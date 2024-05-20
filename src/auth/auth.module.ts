import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth, Profile, Role } from '@/entities';
import { PasswordUtils } from '@/utils/bcrypt';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ProfileService } from '@/profile/profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, Role, Profile]),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, PasswordUtils, AtStrategy, RtStrategy, ProfileService],
  exports: [AuthService],
})
export class AuthModule {}
