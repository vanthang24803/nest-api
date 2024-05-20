import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { Auth as AuthEntity, Role, Role as RoleEntity } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordUtils } from '@/utils/bcrypt';
import { instanceToPlain } from 'class-transformer';
import { Actions, JwtPayload, Token } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env, RoleEnum } from '@/enums';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto, RegisterDto, LoginDto } from './dto';
import { ProfileService } from '@/profile/profile.service';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly passwordUtils: PasswordUtils,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly profileService: ProfileService,
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

    await this.authRepository.save(user);

    const userRole = await this.roleRepository.findOneBy({
      name: RoleEnum.USER,
    });

    if (userRole) {
      user.roles = [userRole];

      await this.authRepository.save(user);

      const url = await this.getUrlEmail(
        user.id,
        user.email,
        user.roles,
        'verify-email',
      );

      try {
        await this.mailerService.sendMail({
          to: user.email,
          subject: 'Verify Your Email',
          html: `Click <a href="${url}">here</a> to verify your email.`,
        });

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

    const isSuccessPassword = await this.passwordUtils.decodePassword(
      loginDto.password,
      exitingUser.password,
    );

    if (!isSuccessPassword) {
      throw new UnauthorizedException('Email or password wrong');
    }

    if (!exitingUser.verifyEmail) {
      throw new UnauthorizedException('Email not verified!');
    }

    if (
      exitingUser.refreshToken &&
      this.jwtService.decode(exitingUser.refreshToken)?.exp > Date.now() / 1000
    ) {
      const accessToken = await this.generateAccessToken(
        exitingUser.id,
        exitingUser.email,
        exitingUser.roles,
      );

      return {
        access_token: accessToken,
        refresh_token: exitingUser.refreshToken,
      };
    }

    const tokens = await this.generateTokens(
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
    const exitingUser = await this.decodeToken(token);

    exitingUser.verifyEmail = true;

    await this.authRepository.save(exitingUser);

    const tokens = await this.generateTokens(
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

    const url = await this.getUrlEmail(
      exitingUser.id,
      exitingUser.email,
      exitingUser.roles,
      'reset-password',
    );

    try {
      await this.mailerService.sendMail({
        to: exitingUser.email,
        subject: 'Forgot Password',
        html: `Click <a href="${url}">here</a> to reset your password.`,
      });

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
    const exitingUser = await this.decodeToken(token);

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

    const roles = this.getNameRole(exitingUser.roles);

    // Check Exp Rf Token
    if (
      exitingUser.refreshToken &&
      this.jwtService.decode(exitingUser.refreshToken)?.exp > Date.now() / 1000
    ) {
      const accessToken = await this.generateAccessToken(
        exitingUser.id,
        exitingUser.email,
        roles,
      );

      return {
        access_token: accessToken,
        refresh_token: exitingUser.refreshToken,
      };
    }

    const tokens = await this.generateTokens(
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
    const roles = Object.values(RoleEnum);
    const roleObjects = [];

    for (const role of roles) {
      const existingRole = await this.roleRepository.findOneBy({ name: role });

      if (!existingRole) {
        const newRole = this.roleRepository.create({ name: role });
        await this.roleRepository.save(newRole);
        roleObjects.push({ role });
      }
    }

    return {
      message: 'Role created successfully!',
    };
  }

  /**
   * TODO : Upgrade Manager Method
   **/

  async upgradeManager(id: string): Promise<object> {
    const exitingUser = await this.authRepository.findOneBy({ id });

    if (!exitingUser) {
      throw new UnauthorizedException();
    }

    const managerRole = await this.roleRepository.findOneBy({
      name: RoleEnum.MANAGER,
    });

    if (!managerRole) {
      throw new NotFoundException();
    }

    const hasManagerRole = exitingUser.roles.some(
      (role) => role.name === RoleEnum.MANAGER,
    );

    if (!hasManagerRole) {
      exitingUser.roles.push(managerRole);

      await this.authRepository.save(exitingUser);

      return {
        message: 'Upgrade Manager successfully!',
      };
    }

    return {
      message: 'The user already has this role !',
    };
  }

  /**
   * TODO : Upgrade Admin Method
   **/

  async upgradeAdmin(id: string): Promise<object> {
    const exitingUser = await this.authRepository.findOneBy({ id });

    if (!exitingUser) {
      throw new UnauthorizedException();
    }

    const adminRole = await this.roleRepository.findOneBy({
      name: RoleEnum.ADMIN,
    });

    if (!adminRole) {
      throw new NotFoundException();
    }

    const hasAdminRole = exitingUser.roles.some(
      (role) => role.name === RoleEnum.ADMIN,
    );

    if (!hasAdminRole) {
      exitingUser.roles.push(adminRole);

      await this.authRepository.save(exitingUser);

      return {
        message: 'Upgrade Admin successfully!',
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

  /**
   * TODO : Generate Tokens
   **/

  async generateTokens(
    id: string,
    email: string,
    roles: Role[],
  ): Promise<Token> {
    const hashRoles = this.getNameRole(roles);

    const jwtPayload: JwtPayload = {
      email,
      sub: id,
      roles: hashRoles,
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

  /**
   * TODO : Generate Access Token
   **/

  async generateAccessToken(
    id: string,
    email: string,
    roles: Role[],
  ): Promise<string> {
    const hashRoles = this.getNameRole(roles);

    const jwtPayload: JwtPayload = {
      email,
      sub: id,
      roles: hashRoles,
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('SECRET'),
      expiresIn: '15m',
    });

    return token;
  }

  /**
   * TODO : Check Exist Account By Email
   **/

  async isExistByEmail(email: string) {
    const user = await this.authRepository.findOneBy({ email });
    return Boolean(user);
  }

  /**
   * TODO : Mapper roles
   **/

  getNameRole(roles: Role[]) {
    const roleNames = [];
    roles.map((item) => roleNames.push(item.name));
    return roleNames;
  }

  /**
   * TODO : Decode Payload JWT Token
   **/

  async decodeToken(token: string) {
    const payload = await this.jwtService.decode(token);

    if (payload?.exp < Date.now() / 1000) {
      throw new UnauthorizedException('Tokens expired!');
    }

    const exitingUser = await this.authRepository.findOneBy({
      id: payload.sub,
    });

    if (!exitingUser) throw new UnauthorizedException();

    return exitingUser;
  }

  /**
   * TODO : Get Url Mail Service
   **/

  async getUrlEmail(
    id: string,
    email: string,
    roles: Role[],
    actions: Actions,
  ): Promise<string> {
    const token = await this.generateAccessToken(id, email, roles);

    const url = `${this.config.get(Env.URL)}/auth/${actions}?token=${token}`;

    return url;
  }

  test() {
    const msg = this.profileService.test();
    return msg;
  }
}
