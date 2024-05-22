import { Image as ImageEntity } from '@/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ImageRepository extends Repository<ImageEntity> {
  constructor(
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
  ) {
    super(
      imageRepository.target,
      imageRepository.manager,
      imageRepository.queryRunner,
    );
  }
}
