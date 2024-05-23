import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OptionService } from './option.service';
import { CreateOptionRequestDto, OptionDto } from './dto';
import { ValidationUUID } from '@/utils';
import { AtGuard } from '../auth/common/guards';
import { Roles } from '../auth/common/decorators';
import { RoleEnum as Role } from '@/enums';

@Controller('options')
@UsePipes(new ValidationPipe())
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Post()
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  create(
    @Query('product_id', new ValidationUUID()) productId: string,
    @Body() create: CreateOptionRequestDto,
  ) {
    return this.optionService.create(productId, create);
  }

  @Get()
  findAll(@Query('product_id', new ValidationUUID()) productId: string) {
    return this.optionService.findAll(productId);
  }

  @Put()
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  update(
    @Query('product_id', new ValidationUUID()) productId: string,
    @Query('id', new ValidationUUID()) id: string,
    @Body() updateOptionDto: OptionDto,
  ) {
    return this.optionService.update(productId, id, updateOptionDto);
  }

  @Delete()
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  remove(
    @Query('product_id', new ValidationUUID()) productId: string,
    @Query('id', new ValidationUUID()) id: string,
  ) {
    return this.optionService.remove(productId, id);
  }
}
