import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class PlanterDto {
  @IsNotEmpty()
  @Min(1)
  @IsNumber()
  price: number;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  sale: number;
}

export class CreatePlanterDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanterDto)
  planters: PlanterDto[];
}

export class UpdatePlanterDto extends PlanterDto {
  @IsBoolean()
  published: boolean;
}

export class DeletePlanter {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlanterId)
  planters: PlanterId[];
}

class PlanterId {
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
