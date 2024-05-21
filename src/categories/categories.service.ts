import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';
import { CategoryRepository } from '@/repositories';
import { Category } from '@/entities';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async getSeed(): Promise<string> {
    return this.categoryRepository.createSeed();
  }

  async create(createCategory: CategoryDto): Promise<Category> {
    const existCategory = await this.categoryRepository.findByName(
      createCategory.name,
    );

    if (existCategory) throw new BadRequestException('Category existed!');

    const category = new Category({
      name: createCategory.name,
    });

    await this.categoryRepository.save(category);

    return category;
  }

  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findById(id: string): Promise<Category> {
    const existCategory = await this.categoryRepository.findOneBy({ id });

    if (!existCategory) throw new NotFoundException();

    return existCategory;
  }

  async update(id: string, updateCategory: CategoryDto): Promise<Category> {
    const existCategory = await this.findById(id);

    existCategory.name = updateCategory.name;

    await this.categoryRepository.save(existCategory);

    return existCategory;
  }

  async remove(id: string): Promise<object> {
    const existCategory = await this.findById(id);
    await this.categoryRepository.remove(existCategory);

    return {
      message: 'Category deleted successfully!',
    };
  }
}
