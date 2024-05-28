import { IsArray, IsNotEmpty } from 'class-validator';

export class OptionDto {
  @IsNotEmpty()
  name: string;
}

export class CreateOptionRequestDto {
  @IsArray()
  options: OptionDto[];
}
