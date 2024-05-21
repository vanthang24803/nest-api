import { IsNotEmpty, Length } from 'class-validator';

export class CategoryDto {
  @IsNotEmpty({ message: 'Category name is required' })
  @Length(1, 255, {
    message: 'Category name length must be between 1 and 255 characters',
  })
  name: string;
}
