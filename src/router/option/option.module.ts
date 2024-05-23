import { Module } from '@nestjs/common';
import { OptionService } from './option.service';
import { OptionController } from './option.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option, Product } from '@/entities';
import { OptionRepository, ProductRepository } from '@/repositories';

@Module({
  imports: [TypeOrmModule.forFeature([Option, Product])],
  controllers: [OptionController],
  providers: [OptionService, OptionRepository, ProductRepository],
})
export class OptionModule {}
