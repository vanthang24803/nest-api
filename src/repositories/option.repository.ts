import { Option, Option as OptionEntity } from '@/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  public async findById(id: string): Promise<Option> {
    const existOption = await this.findOneBy({ id });

    if (!existOption) throw new NotFoundException('Option not found!');

    return existOption;
  }
}
