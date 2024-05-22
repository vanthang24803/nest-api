import { IsNotEmpty } from 'class-validator';

export class OptionDto {
  @IsNotEmpty()
  name: string;
}
