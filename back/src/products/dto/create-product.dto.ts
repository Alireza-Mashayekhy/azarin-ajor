import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

class ProductTranslationDto {
  @IsString()
  @IsNotEmpty()
  locale: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @Min(0)
  price: number;

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
  @ValidateNested({ each: true })
  @Type(() => ProductTranslationDto)
  translations: ProductTranslationDto[];
}
