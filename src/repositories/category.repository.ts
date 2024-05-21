import { Category as CategoryEntity } from '@/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends Repository<CategoryEntity> {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {
    super(
      categoryRepository.target,
      categoryRepository.manager,
      categoryRepository.queryRunner,
    );
  }

  async findByName(name: string) {
    return this.findOneBy({ name });
  }

  public async createSeed() {
    const categories = [
      'Tree',
      'Plant',
      'Planter',
      'Plant Care',
      'Garden & Patio',
      'Gifts',
      'Faux',
      'Orchids',
      'Blooms',
    ];

    for (const category of categories) {
      const existingCategory = await this.findByName(category);

      if (!existingCategory) {
        const newCategory = this.create({ name: category });
        await this.save(newCategory);
      }
    }

    return 'Create categories successfully!';
  }
}
