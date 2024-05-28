import { IsNotEmpty, IsString } from 'class-validator';

export class CreateColorDto {
  colors: ColorDto[];
}

export class ColorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  value: string;
}
