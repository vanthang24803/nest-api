import { Module } from '@nestjs/common';
import { PlanterService } from './planter.service';
import { PlanterController } from './planter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Planter } from '@/entities';
import { PlanterRepository } from '@/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Planter])],
  controllers: [PlanterController],
  providers: [PlanterService, PlanterRepository],
})
export class PlanterModule {}
