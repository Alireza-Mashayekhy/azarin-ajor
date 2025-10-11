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
import { BlogService } from './blog.service';
import { CreateBlogDto, UpdateBlogDto, BlogListQueryDto } from './dto';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';

@Controller()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // Admin: Create blog
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/blog')
  createBlog(@Body() dto: CreateBlogDto) {
    return this.blogService.createBlog(dto);
  }

  // Admin: Update blog
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('admin/blog/:id')
  updateBlog(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    return this.blogService.updateBlog(parseInt(id), dto);
  }

  // Admin: Delete blog
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('admin/blog/:id')
  deleteBlog(@Param('id') id: string) {
    return this.blogService.deleteBlog(parseInt(id));
  }

  // Admin: List all blogs with pagination and search
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/blog')
  listBlogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.blogService.listBlogs(pageNum, limitNum, search);
  }

  // Admin: Get blog by ID (includes unpublished)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/blog/:id')
  getBlogById(@Param('id') id: string) {
    return this.blogService.getBlogById(parseInt(id));
  }

  // Public: Get blog list with pagination
  @Get()
  getBlogList(@Query() query: BlogListQueryDto) {
    return this.blogService.getBlogList(query);
  }

  // Public: Get single blog by slug
  @Get('blog/:slug')
  getBlogBySlug(@Param('slug') slug: string, @Query('locale') locale?: string) {
    return this.blogService.getBlogBySlug(slug, locale);
  }
}
