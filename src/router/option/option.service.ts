import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOptionRequestDto, OptionDto } from './dto/option.dto';
import { OptionRepository, ProductRepository } from '@/repositories';
import { Option } from '@/entities';

@Injectable()
export class OptionService {
  constructor(
    private readonly optionRepository: OptionRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async create(
    id: string,
    create: CreateOptionRequestDto,
  ): Promise<Array<Option>> {
    const existingProduct = await this.productRepository.findById(id);

    if (!Array.isArray(existingProduct.options)) {
      existingProduct.options = [];
    }

    const options = [];

    for (const option of create.options) {
      const newOption = new Option({
        name: option.name,
      });

      await this.optionRepository.save(newOption);

      existingProduct.options.push(newOption);
      options.push(newOption);
    }

    await this.productRepository.save(existingProduct);

    return options;
  }

  async findAll(productId: string): Promise<Array<Option>> {
    const existingProduct = await this.productRepository.findById(productId);
    return existingProduct.options;
  }

  async findOne(productId: string, optionId: string): Promise<Option> {
    await this.productRepository.findById(productId);

    const existingOption = await this.optionRepository.findOne({
      where: { id: optionId },
      relations: {
        planters: true,
      },
    });

    if (!existingOption) throw new NotFoundException();

    return existingOption;
  }

  async update(
    productId: string,
    id: string,
    updateOptionDto: OptionDto,
  ): Promise<Option> {
    await this.productRepository.findById(productId);

    const existOption = await this.optionRepository.findById(id);

    existOption.name = updateOptionDto.name;

    await this.optionRepository.save(existOption);

    return existOption;
  }

  async remove(productId: string, id: string): Promise<boolean> {
    await this.productRepository.findById(productId);

    const existingOption = await this.optionRepository.findById(id);

    await this.optionRepository.remove(existingOption);

    return true;
  }
}
