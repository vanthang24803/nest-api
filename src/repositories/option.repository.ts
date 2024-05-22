import { Option as OptionEntity } from '@/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OptionRepository extends Repository<OptionEntity> {
  constructor(
    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,
  ) {
    super(
      optionRepository.target,
      optionRepository.manager,
      optionRepository.queryRunner,
    );
  }
}
