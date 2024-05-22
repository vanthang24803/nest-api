import { Injectable } from '@nestjs/common';
import { OptionDto } from './dto/option.dto';
import { OptionRepository } from '@/repositories';
import { Option } from '@/entities';

@Injectable()
export class OptionService {
  constructor(private readonly optionRepository: OptionRepository) {}

  async create(createOption: OptionDto): Promise<Option> {
    const option = new Option({
      name: createOption.name,
    });

    await this.optionRepository.save(option);

    return option;
  }

  findAll() {
    return `This action returns all option`;
  }

  findOne(id: number) {
    return `This action returns a #${id} option`;
  }

  update(id: number, updateOptionDto: OptionDto) {
    return `This action updates a #${id} option`;
  }

  remove(id: number) {
    return `This action removes a #${id} option`;
  }
}
