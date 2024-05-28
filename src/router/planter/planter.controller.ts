import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  ValidationPipe,
  UsePipes,
  Delete,
} from '@nestjs/common';
import { PlanterService } from './planter.service';
import {
  CreatePlanterDto,
  DeletePlanter,
  UpdatePlanterDto,
} from './dto/planter.dto';
import { GetOptionId, GetPlanterId, GetProductId } from '@/common/decorators';

@Controller('api/products')
@UsePipes(new ValidationPipe())
export class PlanterController {
  constructor(private readonly planterService: PlanterService) {}

  @Post(':productId/options/:optionId/planters')
  create(
    @GetProductId() productId: string,
    @GetOptionId() optionId: string,
    @Body() create: CreatePlanterDto,
  ) {
    return this.planterService.create(productId, optionId, create);
  }

  @Get(':productId/options/:optionId/planters')
  findAll(@GetProductId() productId: string, @GetOptionId() optionId: string) {
    return this.planterService.findAll(productId, optionId);
  }

  @Get(':productId/options/:optionId/planters/:planterId')
  findOne(
    @GetProductId() productId: string,
    @GetOptionId() optionId: string,
    @GetPlanterId() planterId: string,
  ) {
    return this.planterService.findOne(productId, optionId, planterId);
  }

  @Put(':productId/options/:optionId/planters/:planterId')
  update(
    @GetProductId() productId: string,
    @GetOptionId() optionId: string,
    @GetPlanterId() planterId: string,
    @Body() update: UpdatePlanterDto,
  ) {
    return this.planterService.update(productId, optionId, planterId, update);
  }

  @Delete(':productId/options/:optionId/planters')
  remove(
    @GetProductId() productId: string,
    @GetOptionId() optionId: string,
    @Body() planters: DeletePlanter,
  ) {
    return this.planterService.remove(productId, optionId, planters);
  }
}
