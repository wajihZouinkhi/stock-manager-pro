import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [PrismaModule, ProductsModule, CategoriesModule, DashboardModule],
})
export class AppModule {}
