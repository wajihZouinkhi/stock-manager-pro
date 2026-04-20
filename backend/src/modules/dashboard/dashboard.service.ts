import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getStats() {
    const [totalProducts, lowStock, outOfStock, products, totalCategories, recentMovements] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { isActive: true, quantity: { gt: 0, lte: 5 } } }),
      this.prisma.product.count({ where: { quantity: 0 } }),
      this.prisma.product.findMany({ select: { price: true, quantity: true } }),
      this.prisma.category.count(),
      this.prisma.stockMovement.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { product: true } }),
    ]);

    const lowStockProducts = await this.prisma.product.findMany({
      where: { isActive: true, quantity: { gt: 0, lte: 5 } },
      include: { category: true },
      take: 5,
    });

    const totalValue = products.reduce((acc, p) => acc + p.price * p.quantity, 0);
    const weeklyMovements = await this.getWeeklyMovements();

    return { totalProducts, lowStockCount: lowStock, outOfStockCount: outOfStock, totalValue, totalCategories, recentMovements, lowStockProducts, weeklyMovements };
  }

  private async getWeeklyMovements() {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const movements = await this.prisma.stockMovement.findMany({ where: { createdAt: { gte: weekAgo } }, orderBy: { createdAt: 'asc' } });
    const grouped = new Map<string, { in: number; out: number }>();
    movements.forEach(m => {
      const date = m.createdAt.toISOString().split('T')[0];
      if (!grouped.has(date)) grouped.set(date, { in: 0, out: 0 });
      if (m.type === 'IN') grouped.get(date)!.in += m.quantity;
      else if (m.type === 'OUT') grouped.get(date)!.out += m.quantity;
    });
    return Array.from(grouped.entries()).map(([date, data]) => ({ date, ...data }));
  }
}
