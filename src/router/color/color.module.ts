import { Module } from '@nestjs/common';
import { ColorService } from './color.service';
import { ColorController } from './color.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Color, Option, Planter, Product } from '@/entities';
import {
  ColorRepository,
  OptionRepository,
  PlanterRepository,
  ProductRepository,
} from '@/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Color, Product, Option, Color, Planter])],
  controllers: [ColorController],
  providers: [
    ColorService,
    ColorRepository,
    ProductRepository,
    OptionRepository,
    PlanterRepository,
  ],
})
export class ColorModule {}
