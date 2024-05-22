import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ValidationPipe,
  UsePipes,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Params, ProductQuery, ValidationUUID } from '@/utils';
import { AtGuard } from '../auth/common/guards';
import { Roles } from '../auth/common/decorators';
import { RoleEnum as Role } from '@/enums';

@Controller('products')
@UsePipes(new ValidationPipe())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(@UploadedFile() file, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(file, createProductDto);
  }

  @Get()
  findAll(@Query() queryParams: Params) {
    const productQuery = new ProductQuery(queryParams);
    return this.productService.findAll(productQuery);
  }

  @Get('search')
  search(@Query('q') name: string) {
    return this.productService.search(name);
  }

  @Get(':id')
  findOne(@Param('id', new ValidationUUID()) id: string) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', new ValidationUUID()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id', new ValidationUUID()) id: string) {
    return this.productService.remove(id);
  }
}
