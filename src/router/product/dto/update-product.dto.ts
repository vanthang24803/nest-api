import { IsNotEmpty } from 'class-validator';

export class UpdateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  guide: string;
}
