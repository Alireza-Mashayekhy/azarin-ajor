import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductListQueryDto } from './dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Admin: Create product
  async createProduct(dto: CreateProductDto) {
    // Check if slug already exists
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException('Product with this slug already exists');
    }

    return this.prisma.product.create({
      data: {
        slug: dto.slug,
        price: dto.price,
        imageUrl: dto.imageUrl || null,
        widthMm: dto.widthMm || null,
        heightMm: dto.heightMm || null,
        thicknessMm: dto.thicknessMm || null,
        unitsPerBox: dto.unitsPerBox || null,
        areaPerUnit: dto.areaPerUnit || null,
        translations: {
          create: dto.translations,
        },
      },
      include: {
        translations: true,
      },
    });
  }

  // Admin: Update product
  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    // Check slug uniqueness if slug is being updated
    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });
      if (existing) {
        throw new BadRequestException('Product with this slug already exists');
      }
    }

    // Delete existing translations if new ones provided
    if (dto.translations) {
      await this.prisma.productTranslation.deleteMany({
        where: { productId: id },
      });
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.slug && { slug: dto.slug }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.widthMm !== undefined && { widthMm: dto.widthMm }),
        ...(dto.heightMm !== undefined && { heightMm: dto.heightMm }),
        ...(dto.thicknessMm !== undefined && { thicknessMm: dto.thicknessMm }),
        ...(dto.unitsPerBox !== undefined && { unitsPerBox: dto.unitsPerBox }),
        ...(dto.areaPerUnit !== undefined && { areaPerUnit: dto.areaPerUnit }),
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

  // Admin: Delete product
  async deleteProduct(id: number) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }

  // Public: Get product list with pagination
  async getProductList(query: ProductListQueryDto) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const locale = query.locale || 'fa';

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        skip,
        take: limit,
        orderBy: { id: 'desc' },
        include: {
          translations: {
            where: { locale },
          },
        },
      }),
      this.prisma.product.count(),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Public: Get single product by slug
  async getProductBySlug(slug: string, locale: string = 'fa') {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { locale },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  // Admin: Get single product by ID
  async getProductById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        translations: true,
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Admin: List all products with pagination and search
  async listProducts(page: number = 1, limit: number = 10, search?: string) {
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
    const total = await this.prisma.product.count({
      where: searchConditions,
    });

    // Get products with pagination and search
    const products = await this.prisma.product.findMany({
      where: searchConditions,
      include: {
        translations: true,
      },
      orderBy: { id: 'desc' },
      skip,
      take: limit,
    });

    return {
      products,
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
