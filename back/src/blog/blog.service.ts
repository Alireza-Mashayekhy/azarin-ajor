import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBlogDto, UpdateBlogDto, BlogListQueryDto } from './dto';

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // Admin: Create blog
  async createBlog(dto: CreateBlogDto) {
    // Check if slug already exists
    const existing = await this.prisma.blogPost.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException('Blog with this slug already exists');
    }

    return this.prisma.blogPost.create({
      data: {
        slug: dto.slug,
        categoryId: dto.categoryId,
        publishedAt: new Date(),
        coverImage: dto.coverImage || null,
        translations: {
          create: dto.translations,
        },
      },
      include: {
        translations: true,
        category: {
          include: { translations: true },
        },
      },
    });
  }

  // Admin: Update blog
  async updateBlog(id: number, dto: UpdateBlogDto) {
    const blog = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    // Delete existing translations if new ones provided
    if (dto.translations) {
      await this.prisma.blogPostTranslation.deleteMany({
        where: { blogPostId: id },
      });
    }

    return this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.publishedAt !== undefined && { publishedAt: dto.publishedAt }),
        ...(dto.coverImage !== undefined && { coverImage: dto.coverImage }),
        ...(dto.translations && {
          translations: {
            create: dto.translations,
          },
        }),
      },
      include: {
        translations: true,
        category: {
          include: { translations: true },
        },
      },
    });
  }

  // Admin: Delete blog
  async deleteBlog(id: number) {
    const blog = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!blog) throw new NotFoundException('Blog not found');

    await this.prisma.blogPost.delete({ where: { id } });
    return { message: 'Blog deleted successfully' };
  }

  // Public: Get blog list with pagination
  async getBlogList(query: BlogListQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const locale = query.locale || 'fa';

    const where = {
      publishedAt: { lte: new Date() },
      ...(query.categoryId && { categoryId: query.categoryId }),
    };

    const [blogs, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: {
          translations: {
            where: { locale },
          },
          category: {
            include: {
              translations: {
                where: { locale },
              },
            },
          },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    return {
      blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Public: Get single blog by slug
  async getBlogBySlug(slug: string, locale: string = 'fa') {
    const blog = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { locale },
        },
        category: {
          include: {
            translations: {
              where: { locale },
            },
          },
        },
      },
    });

    if (!blog || !blog.publishedAt || blog.publishedAt > new Date()) {
      throw new NotFoundException('Blog not found');
    }

    return blog;
  }

  // Admin: Get single blog by ID (includes unpublished)
  async getBlogById(id: number) {
    const blog = await this.prisma.blogPost.findUnique({
      where: { id },
      include: {
        translations: true,
        category: {
          include: { translations: true },
        },
      },
    });

    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  // Admin: List all blogs with pagination and search
  async listBlogs(page: number = 1, limit: number = 10, search?: string) {
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
                      content: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                    {
                      excerpt: {
                        contains: search,
                        mode: 'insensitive' as const,
                      },
                    },
                  ],
                },
              },
            },
            // Search by category
            {
              category: {
                translations: {
                  some: {
                    title: { contains: search, mode: 'insensitive' as const },
                  },
                },
              },
            },
          ],
        }
      : {};

    // Get total count for pagination
    const total = await this.prisma.blogPost.count({
      where: searchConditions,
    });

    // Get blogs with pagination and search
    const blogs = await this.prisma.blogPost.findMany({
      where: searchConditions,
      include: {
        translations: true,
        category: {
          include: { translations: true },
        },
      },
      orderBy: { id: 'desc' },
      skip,
      take: limit,
    });

    return {
      blogs,
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
}
