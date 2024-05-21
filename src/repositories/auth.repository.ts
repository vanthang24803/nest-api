import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth as AuthEntity } from '@/entities';
import { Repository } from 'typeorm';

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {
    super(
      authRepository.target,
      authRepository.manager,
      authRepository.queryRunner,
    );
  }

  public async findUserById(id: string) {
    const user = await this.findOneBy({ id });

    if (!user) throw new UnauthorizedException();

    return user;
  }

  public async getProfile(id: string) {
    return await this.findOne({
      where: { id },
      relations: {
        profile: true,
      },
    });
  }

  public async updateRfToken(id: string, rt: string) {
    return await this.update(id, {
      refreshToken: rt,
    });
  }
}
