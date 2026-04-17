import { IsString, IsNumber, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class StockMovementDto {
  @IsIn(['IN', 'OUT', 'ADJUSTMENT']) type: string;
  @Type(() => Number) @IsNumber() quantity: number;
  @IsOptional() @IsString() reason?: string;
}
