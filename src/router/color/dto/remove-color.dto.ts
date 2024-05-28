import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';

export class RemoveColorsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColorId)
  colors: ColorId[];
}

class ColorId {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
