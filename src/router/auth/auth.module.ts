import { Module } from '@nestjs/common';
import { AuthService } from '@/router/auth/auth.service';
import { AuthController } from '@/router/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth, Profile, Role } from '@/entities';
import { PasswordUtils } from '@/utils/bcrypt';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ProfileService } from '@/router/auth/profile/profile.service';
import { RoleService } from '@/router/auth/role/role.service';
import { TokenService } from './token/token.service';
import { MailService } from '@/configs/mail/mail.service';
import { CloudinaryModule } from '@/configs/cloudinary/cloudinary.module';
import { CloudinaryService } from '@/configs/cloudinary/cloudinary.service';
import { RedisModule } from '@/configs/redis/redis.module';
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
    RedisModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
