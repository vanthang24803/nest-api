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
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { AtGuard } from '@/router/auth/common/guards';
import { Roles } from '@/router/auth/common/decorators';
import { RoleEnum as Role } from '@/enums';

@Controller('categories')
@UsePipes(new ValidationPipe())
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  create(@Body() crateCategory: CategoryDto) {
    return this.categoriesService.create(crateCategory);
  }

  @Get()
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get('seeds')
  createSeed() {
    return this.categoriesService.getSeed();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findById(id);
  }

  @Put(':id')
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateCategory: CategoryDto) {
    return this.categoriesService.update(id, updateCategory);
  }

  @Delete(':id')
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
