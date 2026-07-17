import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Max, MaxLength, Min, ValidateNested } from "class-validator";

export class OpenSessionDto {
  @IsString()
  @MaxLength(160)
  qrToken!: string;
}

export class SubmitOrderItemDto {
  @IsString()
  menuItemId!: string;

  @IsInt()
  @Min(1)
  @Max(25)
  quantity!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}

export class SubmitOrderDto {
  @IsString()
  sessionId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubmitOrderItemDto)
  items!: SubmitOrderItemDto[];
}
