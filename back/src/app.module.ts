import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { BlogModule } from './blog/blog.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [PrismaModule, UserModule, BlogModule, CategoryModule],
})
export class AppModule {}
