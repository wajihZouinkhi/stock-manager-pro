import { IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString() name: string;
  @IsOptional() @!sString() description?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() icon?: string;
}
