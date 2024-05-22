import { CategoryDto } from '@/router/categories/dto/category.dto';
import { OptionDto } from '@/router/option/dto';
import { IsArray, IsNotEmpty, Length } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @Length(1, 255, {
    message: 'Product name length must be between 1 and 255 characters',
  })
  name: string;

  @IsNotEmpty()
  category: CategoryDto;

  @IsNotEmpty()
  @IsArray()
  options: OptionDto[];
}
