import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CategoryTranslationDto {
  @IsString()
  locale: string;

  @IsString()
  title: string;
}

export class CreateCategoryDto {
  @IsString()
  slug: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryTranslationDto)
  translations: CategoryTranslationDto[];
}
