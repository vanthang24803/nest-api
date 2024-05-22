import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category, Product, Option } from '@/entities';
import {
  CategoryRepository,
  OptionRepository,
  ProductRepository,
} from '@/repositories';
import { CloudinaryService } from '@/configs/cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Option, Category])],
  providers: [
    ProductService,
    ProductRepository,
    OptionRepository,
    CategoryRepository,
    CloudinaryService,
  ],
  controllers: [ProductController],
})
export class ProductModule {}
