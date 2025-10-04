import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BlogTranslationDto {
  @IsString()
  locale: string;

  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;
}

export class CreateBlogDto {
  @IsString()
  slug: string;

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsDateString()
  publishedAt?: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogTranslationDto)
  translations: BlogTranslationDto[];
}
