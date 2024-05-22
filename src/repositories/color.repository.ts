import { Color as ColorEntity } from '@/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ColorRepository extends Repository<ColorEntity> {
  constructor(
    @InjectRepository(ColorEntity)
    private readonly colorRepository: Repository<ColorEntity>,
  ) {
    super(
      colorRepository.target,
      colorRepository.manager,
      colorRepository.queryRunner,
    );
  }
}
