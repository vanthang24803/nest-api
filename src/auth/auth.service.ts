import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { Auth as AuthEntity } from '@/entities/auth.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordUtils } from '@/utils/bcrypt';
import { instanceToPlain } from 'class-transformer';
import { JwtPayload, Status, Token } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env } from '@/constant';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private authRepository: Repository<AuthEntity>,
    private readonly passwordUtils: PasswordUtils,
    private readonly jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { password, ...rest } = registerDto;

    const hashedPassword = await this.passwordUtils.encodePassword(password);

    const user = new AuthEntity({
      ...rest,
      password: hashedPassword,
    });

    await this.authRepository.save(user);

    return instanceToPlain(user);
  }

  async login(loginDto: LoginDto): Promise<Status | Token> {
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

    if (
      exitingUser.refreshToken &&
      this.jwtService.decode(exitingUser.refreshToken)?.exp > Date.now() / 1000
    ) {
      const accessToken = await this.generateAccessToken(
        exitingUser.id,
        exitingUser.email,
      );

      return {
        access_token: accessToken,
        refresh_token: exitingUser.refreshToken,
      };
    }

    const tokens = await this.generateTokens(exitingUser.id, exitingUser.email);
    await this.updateRfToken(exitingUser.id, tokens.refresh_token);

    return tokens;
  }

  async logout(id: string): Promise<boolean> {
    await this.authRepository.update(id, {
      refreshToken: null,
    });

    return true;
  }

  /**
   * TODO : Refresh Token
   * */

  async refreshToken(id: string, rt: string): Promise<Token> {
    const exitingUser = await this.authRepository.findOneBy({
      id,
    });

    if (!exitingUser || !exitingUser.refreshToken)
      throw new ForbiddenException('Unauthorized');

    const rtMatches = rt === exitingUser.refreshToken;
    if (!rtMatches) throw new ForbiddenException('Unauthorized');

    // Check Exp Rf Token
    if (
      exitingUser.refreshToken &&
      this.jwtService.decode(exitingUser.refreshToken)?.exp > Date.now() / 1000
    ) {
      const accessToken = await this.generateAccessToken(
        exitingUser.id,
        exitingUser.email,
      );

      return {
        access_token: accessToken,
        refresh_token: exitingUser.refreshToken,
      };
    }

    const tokens = await this.generateTokens(exitingUser.id, exitingUser.email);

    await this.updateRfToken(exitingUser.id, tokens.refresh_token);

    return tokens;
  }

  /**
   * TODO : Generate Tokens
   * */

  async generateTokens(id: string, email: string): Promise<Token> {
    const jwtPayload: JwtPayload = {
      email,
      sub: id,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>(Env.SECRET),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.config.get<string>(Env.REFRESH),
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async generateAccessToken(id: string, email: string): Promise<string> {
    const jwtPayload: JwtPayload = {
      email,
      sub: id,
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('SECRET'),
      expiresIn: '15m',
    });

    return token;
  }

  /**
   * TODO : Update Refresh Token
   * */

  async updateRfToken(id: string, rt: string): Promise<void> {
    await this.authRepository.update(id, {
      refreshToken: rt,
    });
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
