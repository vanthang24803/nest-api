import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from '@/auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from '@/auth/entities/auth.entity';
import { JwtUtils } from '@/utils/jwt';
import { PasswordUtils } from '@/utils/bcrypt';

@Module({
  imports: [TypeOrmModule.forFeature([Auth])],
  controllers: [AuthController],
  providers: [AuthService, JwtUtils, PasswordUtils],
})
export class AuthModule {}
