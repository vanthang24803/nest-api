import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import {
  ColorRepository,
  OptionRepository,
  PlanterRepository,
  ProductRepository,
} from '@/repositories';
import { Color } from '@/entities';
import { RemoveColorsDto } from './dto';

@Injectable()
export class ColorService {
  constructor(
    private readonly optionRepository: OptionRepository,
    private readonly productRepository: ProductRepository,
    private readonly planterRepository: PlanterRepository,
    private readonly colorRepository: ColorRepository,
  ) {}

  async create(
    productId: string,
    optionId: string,
    planterId: string,
    createColorDto: CreateColorDto,
  ): Promise<Array<Color>> {
    const colors = [];

    await this.productRepository.findById(productId);

    await this.optionRepository.findById(optionId);

    const planter = await this.planterRepository.findById(planterId);

    if (!Array.isArray(planter.colors)) {
      planter.colors = [];
    }

    for (const color of createColorDto.colors) {
      const newColor = new Color({
        name: color.name,
        value: color.value,
      });

      await this.colorRepository.save(newColor);

      planter.colors.push(newColor);

      colors.push(newColor);
    }

    await this.planterRepository.save(planter);

    return colors;
  }

  async findAll(
    productId: string,
    optionId: string,
    planterId: string,
  ): Promise<Array<Color>> {
    await this.productRepository.findById(productId);

    await this.optionRepository.findById(optionId);

    const planter = await this.planterRepository.findById(planterId, true);

    return planter.colors;
  }

  async findOne(
    productId: string,
    optionId: string,
    planterId: string,
    id: string,
  ): Promise<Color> {
    await this.productRepository.findById(productId);

    await this.optionRepository.findById(optionId);

    await this.planterRepository.findById(planterId);

    const color = await this.colorRepository.findOneBy({ id });

    if (!color) throw new NotFoundException();

    return color;
  }

  async update(
    productId: string,
    optionId: string,
    planterId: string,
    id: string,
    updateColorDto: UpdateColorDto,
  ): Promise<Color> {
    await this.productRepository.findById(productId);

    await this.optionRepository.findById(optionId);

    await this.planterRepository.findById(planterId);

    const color = await this.colorRepository.findOneBy({ id });

    if (!color) throw new NotFoundException();

    Object.assign(color, updateColorDto);

    await this.colorRepository.save(color);

    return color;
  }

  async remove(
    productId: string,
    optionId: string,
    planterId: string,
    removeDto: RemoveColorsDto,
  ): Promise<boolean> {
    await this.productRepository.findById(productId);

    await this.optionRepository.findById(optionId);

    await this.planterRepository.findById(planterId);

    for (const item of removeDto.colors) {
      const existingColor = await this.colorRepository.findOneBy({
        id: item.id,
      });

      if (!existingColor) throw new NotFoundException();

      await this.colorRepository.remove(existingColor);
    }

    return true;
  }
}
