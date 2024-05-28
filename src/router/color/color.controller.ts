import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  Put,
} from '@nestjs/common';
import { ColorService } from './color.service';
import { UpdateColorDto, CreateColorDto, RemoveColorsDto } from './dto';
import { GetOptionId, GetPlanterId, GetProductId } from '@/common/decorators';

@Controller('api/products')
@UsePipes(new ValidationPipe())
export class ColorController {
  constructor(private readonly colorService: ColorService) {}

  @Post(':productId/options/:optionId/planters/:planterId/colors')
  create(
    @GetProductId() productId: string,
    @GetOptionId() optionId: string,
    @GetPlanterId() planterId: string,
    @Body() createColorDto: CreateColorDto,
  ) {
    return this.colorService.create(
      productId,
      optionId,
      planterId,
      createColorDto,
    );
  }

  @Get(':productId/options/:optionId/planters/:planterId/colors')
  findAll(
    @GetProductId() productId: string,
    @GetOptionId() optionId: string,
    @GetPlanterId() planterId: string,
  ) {
    return this.colorService.findAll(productId, optionId, planterId);
  }

  @Get(':productId/options/:optionId/planters/:planterId/colors:id')
  findOne(
    @GetProductId() productId: string,
    @GetOptionId() optionId: string,
    @GetPlanterId() planterId: string,
    @Param('id') id: string,
  ) {
    return this.colorService.findOne(productId, optionId, planterId, id);
  }

  @Put(':productId/options/:optionId/planters/:planterId/colors:id')
  update(
    @GetProductId() productId: string,
    @GetOptionId() optionId: string,
    @GetPlanterId() planterId: string,
    @Param('id') id: string,
    @Body() updateColorDto: UpdateColorDto,
  ) {
    return this.colorService.update(
      productId,
      optionId,
      planterId,
      id,
      updateColorDto,
    );
  }

  @Delete(':productId/options/:optionId/planters/:planterId/colors')
  remove(
    @GetProductId() productId: string,
    @GetOptionId() optionId: string,
    @GetPlanterId() planterId: string,
    @Body() removeDto: RemoveColorsDto,
  ) {
    return this.colorService.remove(productId, optionId, planterId, removeDto);
  }
}
