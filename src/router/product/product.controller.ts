import {
  Controller,
  Get,
  Post,
  Body,
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
import { Params, ProductQuery } from '@/utils';
import { AtGuard } from '@/common/guards';
import { Roles , GetProductId } from '@/common/decorators';
import { RoleEnum as Role } from '@/enums';

@Controller('api/products')
@UsePipes(new ValidationPipe())
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
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

  @Get(':productId')
  findOne(@GetProductId() id: string) {
    return this.productService.findOne(id);
  }

  @Put(':productId')
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  update(
    @GetProductId() id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete('productId')
  @UseGuards(AtGuard)
  @Roles(Role.ADMIN)
  remove(@GetProductId() id: string) {
    return this.productService.remove(id);
  }
}
