import { IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString() name: string;
  @IsString() sku: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Number) @IsNumber() @Min(0) price: number;
  @Type(() => Number) @IsNumber() @Min(0) costPrice: number;
  @Type(() => Number) @IsNumber() @Min(0) quantity: number;
  @Type(() => Number) @IsNumber() @Min(0) minQuantity: number;
  @IsOptional() @IsString() unit?: string;
  @IsOptional() @IsBoolean() isActive?: boolean;
  @IsOptional() @Type(() => Number) @IsNumber() categoryId?: number;
}
