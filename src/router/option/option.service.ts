import { Injectable } from '@nestjs/common';
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

  async remove(productId: string, id: string): Promise<{ message: string }> {
    const existingProduct = await this.productRepository.findById(productId);

    await this.optionRepository.findById(id);

    existingProduct.options = existingProduct.options.filter(
      (option) => option.id !== id,
    );

    await this.productRepository.save(existingProduct);

    return {
      message: 'Option deleted successfully',
    };
  }
}
