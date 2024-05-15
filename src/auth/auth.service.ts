import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { Auth as AuthEntity } from '@/auth/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordUtils } from '@/utils/bcrypt';
import { JwtUtils } from '@/utils/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    private readonly jwtUtils: JwtUtils,
    private readonly passwordUtils: PasswordUtils,
  ) {}
  async register(registerDto: RegisterDto) {
    const { password, ...rest } = registerDto;

    const hashedPassword = await this.passwordUtils.encodePassword(password);

    const user = new AuthEntity({
      ...rest,
      password: hashedPassword,
    });

    await this.authRepository.save(user);

    return rest;
  }

  async login(loginDto: LoginDto) {
    const exitingUser = await this.authRepository.findOneBy({
      email: loginDto.email,
    });

    if (!exitingUser) {
      return {
        isSuccess: false,
        message: 'Email or password wrong',
      };
    }

    const isSuccessPassword = await this.passwordUtils.decodePassword(
      loginDto.password,
      exitingUser.password,
    );

    if (!isSuccessPassword) {
      return {
        isSuccess: false,
        message: 'Email or password wrong',
      };
    }

    const accessToken = this.jwtUtils.generateAccessToken(
      { id: exitingUser.id },
      '10m',
    );

    const refreshToken = this.jwtUtils.generateRefreshToken(
      {
        id: exitingUser.id,
      },
      '30d',
    );

    return { isSuccess: true, accessToken, refreshToken };
  }

  async isExistById(id: string) {
    const user = await this.authRepository.findOneBy({ id });
    return Boolean(user);
  }

  async isExistByEmail(email: string) {
    const user = await this.authRepository.findOneBy({ email });
    return Boolean(user);
  }
}
