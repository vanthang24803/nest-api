import { Injectable } from '@nestjs/common';
import {
  CreatePlanterDto,
  DeletePlanter,
  UpdatePlanterDto,
} from './dto/planter.dto';
import {
  OptionRepository,
  PlanterRepository,
  ProductRepository,
} from '@/repositories';
import { Planter } from '@/entities';

@Injectable()
export class PlanterService {
  constructor(
    private readonly optionRepository: OptionRepository,
    private readonly productRepository: ProductRepository,
    private readonly planterRepository: PlanterRepository,
  ) {}

  async create(
    productId: string,
    optionId: string,
    create: CreatePlanterDto,
  ): Promise<Array<Planter>> {
    await this.productRepository.findById(productId);

    const existingOption = await this.optionRepository.findById(optionId);

    if (!Array.isArray(existingOption.planters)) {
      existingOption.planters = [];
    }

    const planterCreated = [];

    for (const planter of create.planters) {
      const newPlanter = new Planter({
        name: planter.name,
        price: planter.price,
        sale: planter.sale,
        published: false,
      });

      await this.planterRepository.save(newPlanter);

      existingOption.planters.push(newPlanter);

      planterCreated.push(newPlanter);
    }

    await this.optionRepository.save(existingOption);

    return planterCreated;
  }

  async findAll(productId: string, optionId: string): Promise<Array<Planter>> {
    await this.productRepository.findById(productId);

    const existingOption = await this.optionRepository.findById(optionId, true);

    return existingOption.planters;
  }

  async findOne(
    productId: string,
    optionId: string,
    planterId: string,
  ): Promise<Planter> {
    await this.productRepository.findById(productId);

    await this.optionRepository.findById(optionId);

    const planter = await this.planterRepository.findById(planterId, true);

    return planter;
  }

  async update(
    productId: string,
    optionId: string,
    planterId: string,
    updatePlanterDto: UpdatePlanterDto,
  ): Promise<Planter> {
    await this.productRepository.findById(productId);

    await this.optionRepository.findById(optionId);

    const planter = await this.planterRepository.findById(planterId, true);

    Object.assign(planter, updatePlanterDto);

    await this.planterRepository.save(planter);

    return planter;
  }

  async remove(
    productId: string,
    optionId: string,
    body: DeletePlanter,
  ): Promise<boolean> {
    await this.productRepository.findById(productId);

    await this.optionRepository.findById(optionId);

    for (const item of body.planters) {
      const existingPlanter = await this.planterRepository.findById(item.id);

      await this.planterRepository.remove(existingPlanter);
    }

    return true;
  }
}
