import { Planter as PlanterEntity } from '@/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PlanterRepository extends Repository<PlanterEntity> {
  constructor(
    @InjectRepository(PlanterEntity)
    private readonly planterRepository: Repository<PlanterEntity>,
  ) {
    super(
      planterRepository.target,
      planterRepository.manager,
      planterRepository.queryRunner,
    );
  }
}
