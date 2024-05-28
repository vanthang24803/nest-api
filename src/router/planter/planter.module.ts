import { Module } from '@nestjs/common';
import { PlanterService } from './planter.service';
import { PlanterController } from './planter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planter, Product, Option } from '@/entities';
import {
  OptionRepository,
  PlanterRepository,
  ProductRepository,
} from '@/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Planter, Product, Option])],
  controllers: [PlanterController],
  providers: [
    PlanterService,
    PlanterRepository,
    OptionRepository,
    ProductRepository,
  ],
})
export class PlanterModule {}
