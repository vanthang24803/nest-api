import { Planter as PlanterEntity } from '@/entities';
import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findById(id: string, relation: boolean = false) {
    const existingPlanter = await this.findOne({
      where: {
        id,
      },
      relations: {
        colors: relation,
      },
    });

    if (!existingPlanter) throw new NotFoundException('Planter not found!');

    return existingPlanter;
  }
}
