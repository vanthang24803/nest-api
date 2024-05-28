import { IsNotEmpty } from 'class-validator';

export class ImageDto {
  @IsNotEmpty()
  id: string;
}
