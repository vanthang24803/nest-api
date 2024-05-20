import { Auth as AuthEntity, Profile as ProfileEntity } from '@/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(ProfileEntity)
    private readonly profileRepository: Repository<ProfileEntity>,
  ) {}

  /**
   * TODO : Create Profile
   **/

  async createProfile(user: AuthEntity): Promise<AuthEntity> {
    const profile = new ProfileEntity();

    user.profile = profile;

    await this.profileRepository.save(profile);

    return user;
  }
}
