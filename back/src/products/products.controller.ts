import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductListQueryDto } from './dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Admin: Create product
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/products')
  createProduct(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  // Admin: Update product
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('admin/products/:id')
  updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.updateProduct(parseInt(id), dto);
  }

  // Admin: Delete product
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/products/:id')
  deleteProduct(@Param('id') id: string) {
    return this.productsService.deleteProduct(parseInt(id));
  }

  // Admin: List all products with pagination and search
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/products')
  listProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.productsService.listProducts(pageNum, limitNum, search);
  }

  // Admin: Get product by ID
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/products/:id')
  getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(parseInt(id));
  }

  // Public: Get product list with pagination
  @Get('products')
  getProductList(@Query() query: ProductListQueryDto) {
    return this.productsService.getProductList(query);
  }

  // Public: Get single product by slug
  @Get('products/:slug')
  getProductBySlug(
    @Param('slug') slug: string,
    @Query('locale') locale?: string,
  ) {
    return this.productsService.getProductBySlug(slug, locale);
  }
}
