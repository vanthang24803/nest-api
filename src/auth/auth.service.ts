import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { Auth as AuthEntity, Role as RoleEntity } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordUtils } from '@/utils/bcrypt';
import { instanceToPlain } from 'class-transformer';
import { Token } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RoleEnum, RoleEnumType } from '@/enums';
import { ResetPasswordDto, RegisterDto, LoginDto } from './dto';
import { ProfileService } from '@/auth/profile/profile.service';
import { RoleService } from '@/auth/role/role.service';
import { TokenService } from '@/auth/token/token.service';
import { MailService } from '@/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly passwordUtils: PasswordUtils,
    private readonly jwtService: JwtService,
    private readonly profileService: ProfileService,
    private readonly roleService: RoleService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
  ) {}

  /**
   * TODO : Register Method
   **/

  async register(registerDto: RegisterDto) {
    const { password, ...rest } = registerDto;

    const existEmail = await this.isExistByEmail(rest.email);

    if (existEmail) {
      throw new UnauthorizedException('Email already exists!');
    }

    const hashedPassword = await this.passwordUtils.encodePassword(password);

    const user = new AuthEntity({
      ...rest,
      password: hashedPassword,
    });

    await this.profileService.createProfile(user);

    const userRole = await this.roleRepository.findOneBy({
      name: RoleEnum.USER,
    });

    if (userRole) {
      user.roles = [userRole];

      await this.authRepository.save(user);

      const url = await this.mailService.getUrlEmail(
        user.id,
        user.email,
        user.roles,
        'verify-email',
      );

      try {
        await this.mailService.sendMail(
          user.email,
          'Verify Your Email',
          `Click <a href="${url}">here</a> to verify your email.`,
        );

        return instanceToPlain(user);
      } catch (error) {
        throw new BadRequestException(error);
      }
    }
    throw new NotFoundException('Role not found!');
  }

  /**
   * TODO : Login Method
   **/

  async login(loginDto: LoginDto): Promise<Token> {
    const exitingUser = await this.authRepository.findOne({
      relations: {
        roles: true,
      },
      where: { email: loginDto.email },
    });

    if (!exitingUser) {
      throw new UnauthorizedException('Email or password wrong');
    }

    const passwordMatches = await this.passwordUtils.decodePassword(
      loginDto.password,
      exitingUser.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Email or password wrong');
    }

    if (!exitingUser.verifyEmail) {
      throw new UnauthorizedException('Email not verified!');
    }

    if (
      exitingUser.refreshToken &&
      this.jwtService.decode(exitingUser.refreshToken)?.exp > Date.now() / 1000
    ) {
      const accessToken = await this.tokenService.generateAccessToken(
        exitingUser.id,
        exitingUser.email,
        exitingUser.roles,
      );

      return {
        access_token: accessToken,
        refresh_token: exitingUser.refreshToken,
      };
    }

    const tokens = await this.tokenService.generateTokens(
      exitingUser.id,
      exitingUser.email,
      exitingUser.roles,
    );

    await this.updateRfToken(exitingUser.id, tokens.refresh_token);

    return tokens;
  }

  /**
   * TODO : Logout Method
   **/

  async logout(id: string): Promise<boolean> {
    await this.authRepository.update(id, {
      refreshToken: null,
    });

    return true;
  }

  /**
   * TODO : Verify Email Method
   **/

  async verifyEmail(token: string): Promise<Token> {
    const id = await this.tokenService.decodeToken(token);

    const exitingUser = await this.getUserById(id);

    exitingUser.verifyEmail = true;

    await this.authRepository.save(exitingUser);

    const tokens = await this.tokenService.generateTokens(
      exitingUser.id,
      exitingUser.email,
      exitingUser.roles,
    );

    await this.updateRfToken(exitingUser.id, tokens.refresh_token);

    return tokens;
  }

  /**
   * TODO : Forgot Password Method
   **/

  async forgotPassword(email: string): Promise<object> {
    const exitingUser = await this.authRepository.findOneBy({ email });

    if (!exitingUser) throw new NotFoundException();

    const url = await this.mailService.getUrlEmail(
      exitingUser.id,
      exitingUser.email,
      exitingUser.roles,
      'reset-password',
    );

    try {
      await this.mailService.sendMail(
        exitingUser.email,
        'Forgot Password',
        `Click <a href="${url}">here</a> to reset your password.`,
      );

      return {
        message: 'Reset password mail sended successfully!',
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * TODO : Reset Password Method
   **/

  async resetPassword(
    token: string,
    resetPassword: ResetPasswordDto,
  ): Promise<object> {
    const id = await this.tokenService.decodeToken(token);

    const exitingUser = await this.getUserById(id);

    const passwordMatches = await this.passwordUtils.decodePassword(
      resetPassword.oldPassword,
      exitingUser.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Old password wrong!');
    }

    const hashedPassword = await this.passwordUtils.encodePassword(
      resetPassword.newPassword,
    );

    exitingUser.password = hashedPassword;

    await this.authRepository.save(exitingUser);

    return {
      message: 'Updated password successfully!',
    };
  }

  /**
   * TODO : Refresh Token Method
   **/

  async refreshToken(id: string, rt: string): Promise<Token> {
    const exitingUser = await this.authRepository.findOne({
      relations: {
        roles: true,
      },
      where: { id },
    });

    if (!exitingUser || !exitingUser.refreshToken)
      throw new ForbiddenException('Unauthorized');

    const rtMatches = rt === exitingUser.refreshToken;
    if (!rtMatches) throw new ForbiddenException('Unauthorized');

    const roles = this.roleService.getNameRole(exitingUser.roles);

    // Check Exp Rf Token
    if (
      exitingUser.refreshToken &&
      this.jwtService.decode(exitingUser.refreshToken)?.exp > Date.now() / 1000
    ) {
      const accessToken = await this.tokenService.generateAccessToken(
        exitingUser.id,
        exitingUser.email,
        roles,
      );

      return {
        access_token: accessToken,
        refresh_token: exitingUser.refreshToken,
      };
    }

    const tokens = await this.tokenService.generateTokens(
      exitingUser.id,
      exitingUser.email,
      roles,
    );

    await this.updateRfToken(exitingUser.id, tokens.refresh_token);

    return tokens;
  }

  /**
   * TODO : Create Roles Method
   **/

  async getRoles(): Promise<object> {
    return await this.roleService.createRoles();
  }

  /**
   * TODO : Check Exist Account By Email
   **/

  async isExistByEmail(email: string) {
    const user = await this.authRepository.findOneBy({ email });
    return Boolean(user);
  }

  /**
   * TODO : Check Exist Account By Id
   **/

  async getUserById(id: string) {
    const user = await this.authRepository.findOneBy({ id });
    if (!user) throw new NotFoundException();
    return user;
  }

  /**
   * TODO : Upgrade Role Method
   **/

  async upgradeRole(id: string, role: RoleEnumType): Promise<object> {
    const exitingUser = await this.authRepository.findOneBy({ id });

    if (!exitingUser) {
      throw new UnauthorizedException();
    }

    const existRole = await this.roleRepository.findOneBy({
      name: role,
    });

    if (!existRole) {
      throw new NotFoundException();
    }

    const hasExistRole = exitingUser.roles.some((item) => item.name === role);

    if (!hasExistRole) {
      exitingUser.roles.push(existRole);

      await this.authRepository.save(exitingUser);

      return {
        message: `Upgrade ${role} successfully!`,
      };
    }

    return {
      message: 'The user already has this role !',
    };
  }

  /**
   * TODO : Update Refresh Token
   **/

  async updateRfToken(id: string, rt: string): Promise<void> {
    await this.authRepository.update(id, {
      refreshToken: rt,
    });
  }
}
