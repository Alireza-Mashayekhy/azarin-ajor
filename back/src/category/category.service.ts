import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  // Admin: Create category
  async createCategory(dto: CreateCategoryDto) {
    return this.prisma.blogCategory.create({
      data: {
        slug: dto.slug,
        translations: {
          create: dto.translations,
        },
      },
      include: {
        translations: true,
      },
    });
  }

  // Admin: Update category
  async updateCategory(id: number, dto: UpdateCategoryDto) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');

    // Delete existing translations if new ones provided
    if (dto.translations) {
      await this.prisma.blogCategoryTranslation.deleteMany({
        where: { categoryId: id },
      });
    }

    return this.prisma.blogCategory.update({
      where: { id },
      data: {
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.translations && {
          translations: {
            create: dto.translations,
          },
        }),
      },
      include: {
        translations: true,
      },
    });
  }

  // Admin: Delete category
  async deleteCategory(id: number) {
    const category = await this.prisma.blogCategory.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException('Category not found');

    await this.prisma.blogCategory.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }

  // Admin: List all categories with pagination and search
  async listCategories(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Build search conditions
    const searchConditions = search
      ? {
          OR: [
            // Search by ID if search term is numeric and within INT4 range
            ...(isNaN(Number(search)) ||
            Number(search) > 2147483647 ||
            Number(search) < 1
              ? []
              : [{ id: Number(search) }]),
            // Search by slug
            { slug: { contains: search, mode: 'insensitive' as const } },
            // Search by translations
            {
              translations: {
                some: {
                  OR: [
                    {
                      title: { contains: search, mode: 'insensitive' as const },
                    },
                    {
                      description: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                  ],
                },
              },
            },
          ],
        }
      : {};

    // Get total count for pagination
    const total = await this.prisma.blogCategory.count({
      where: searchConditions,
    });

    // Get categories with pagination and search
    const categories = await this.prisma.blogCategory.findMany({
      where: searchConditions,
      include: {
        translations: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { id: 'desc' },
      skip,
      take: limit,
    });

    return {
      categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Public: Get all categories with translations
  async getCategories(locale: string = 'fa') {
    return this.prisma.blogCategory.findMany({
      include: {
        translations: {
          where: { locale },
        },
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { id: 'asc' },
    });
  }
}
