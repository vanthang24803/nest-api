import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { RegisterDto } from '@/auth/dto/register.dto';
import { LoginDto } from '@/auth/dto/login.dto';
import { Auth as AuthEntity, Role, Role as RoleEntity } from '@/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordUtils } from '@/utils/bcrypt';
import { instanceToPlain } from 'class-transformer';
import { JwtPayload, Token } from './types';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Env, RoleEnum } from '@/enums';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    private readonly passwordUtils: PasswordUtils,
    private readonly jwtService: JwtService,
    private config: ConfigService,
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

      return instanceToPlain(user);
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

    const roles = this.getNameRole(exitingUser.roles);

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
   * TODO : Logout Method
   **/

  async logout(id: string): Promise<boolean> {
    await this.authRepository.update(id, {
      refreshToken: null,
    });

    return true;
  }

  /**
   * TODO : Refresh Token
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
   * TODO : Generate Tokens
   **/

  async generateTokens(
    id: string,
    email: string,
    roles: string[],
  ): Promise<Token> {
    const jwtPayload: JwtPayload = {
      email,
      sub: id,
      roles,
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

  async generateAccessToken(
    id: string,
    email: string,
    roles: string[],
  ): Promise<string> {
    const jwtPayload: JwtPayload = {
      email,
      sub: id,
      roles,
    };

    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('SECRET'),
      expiresIn: '15m',
    });

    return token;
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
   * TODO : Create Roles
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

  async isExistByEmail(email: string) {
    const user = await this.authRepository.findOneBy({ email });
    return Boolean(user);
  }

  getNameRole(roles: Role[]) {
    const roleNames = [];
    roles.map((item) => roleNames.push(item.name));
    return roleNames;
  }
}
