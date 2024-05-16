import { Module } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { AuthController } from '@/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '@/entities/auth.entity';
import { PasswordUtils } from '@/utils/bcrypt';
import { AtStrategy, RtStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Auth]), JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, PasswordUtils, AtStrategy, RtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
