import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  CategoryRepository,
  OptionRepository,
  ProductRepository,
} from '@/repositories';
import { CloudinaryService } from '@/configs/cloudinary/cloudinary.service';
import { Option, Product } from '@/entities';
import { Message, ProductResponse } from './types';
import { Params } from '@/utils';
import { instanceToPlain } from 'class-transformer';
import { ILike } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    private readonly optionRepository: OptionRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    private readonly uploadService: CloudinaryService,
  ) {}

  async create(
    file: Express.Multer.File,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const existCategory = await this.categoryRepository.findByName(
      createProductDto.category.name,
    );

    if (!existCategory) throw new NotFoundException('Category not exist!');

    const thumbnail = await this.uploadService.uploadFile(file);

    const newProduct = new Product({
      name: createProductDto.name,
      thumbnail: thumbnail.url,
      categories: [],
      options: [],
    });

    newProduct.categories.push(existCategory);

    for (const option of createProductDto.options) {
      const newOptions = new Option({
        name: option.name,
      });

      await this.optionRepository.save(newOptions);

      newProduct.options.push(newOptions);
    }

    await this.productRepository.save(newProduct);

    return newProduct;
  }

  async findAll(query: Params): Promise<ProductResponse> {
    const { limit, page } = query;

    const [products, totalProducts] = await this.productRepository.findAndCount(
      {
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      page: Number(page),
      totalProducts,
      limit: Number(limit),
      totalPages,
      products: instanceToPlain(products),
    };
  }

  async findOne(id: string): Promise<Product> {
    return await this.productRepository.findById(id);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existProduct = await this.productRepository.findById(id);

    existProduct.name = updateProductDto.name;
    existProduct.guide = updateProductDto.guide;
    existProduct.description = updateProductDto.description;

    await this.productRepository.save(existProduct);

    return existProduct;
  }

  async remove(id: string): Promise<Message> {
    const existProduct = await this.productRepository.findById(id);

    await this.productRepository.remove(existProduct);

    return {
      message: 'Product deleted successfully!',
    };
  }

  async search(name: string) {
    return this.productRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });
  }
}
