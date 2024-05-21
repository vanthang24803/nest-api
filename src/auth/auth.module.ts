import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth, Profile, Role } from '@/entities';
import { PasswordUtils } from '@/utils/bcrypt';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ProfileService } from '@/auth/profile/profile.service';
import { RoleService } from '@/auth/role/role.service';
import { TokenService } from './token/token.service';
import { MailService } from '@/mail/mail.service';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import { RedisModule } from '@/redis/redis.module';
import { AuthRepository, RoleRepository } from '@/repositories';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth, Role, Profile]),
    JwtModule.register({}),
    CloudinaryModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    PasswordUtils,
    AtStrategy,
    RtStrategy,
    ProfileService,
    RoleService,
    TokenService,
    MailService,
    CloudinaryService,
    AuthRepository,
    RoleRepository,
    RedisModule
  ],
  exports: [AuthService],
})
export class AuthModule {}
