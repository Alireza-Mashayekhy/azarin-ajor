import {
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BlogTranslationDto } from './create-blog.dto';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsInt()
  categoryId?: number;

  @IsOptional()
  @IsDateString()
  publishedAt?: Date;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlogTranslationDto)
  translations?: BlogTranslationDto[];
}
