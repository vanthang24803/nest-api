import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  ValidationPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionRequestDto, OptionDto } from './dto';
import { RoleEnum as Role } from '@/enums';
import { AtGuard } from '@/common/guards';
import { GetProductId, GetOptionId, Roles } from '@/common/decorators';

@Controller('api/products')
@UsePipes(new ValidationPipe())
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post('/:productId/options')
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  create(
    @GetProductId() productId: string,
    @Body() create: CreateOptionRequestDto,
  ) {
    return this.optionService.create(productId, create);
  }

  @Get('/:productId/options')
  findAll(@GetProductId() productId: string) {
    return this.optionService.findAll(productId);
  }

  @Put('/:productId/options/:optionId')
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  update(
    @GetProductId() productId: string,
    @GetOptionId() id: string,
    @Body() updateOptionDto: OptionDto,
  ) {
    return this.optionService.update(productId, id, updateOptionDto);
  }

  @Delete('/:productId/options/:optionId')
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  remove(@GetProductId() productId: string, @GetOptionId() id: string) {
    return this.optionService.remove(productId, id);
  }
}
