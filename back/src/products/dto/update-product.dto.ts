import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductTranslationDto {
  @IsString()
  locale: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  widthMm?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  heightMm?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  thicknessMm?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  unitsPerBox?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  areaPerUnit?: number;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations?: ProductTranslationDto[];
}
