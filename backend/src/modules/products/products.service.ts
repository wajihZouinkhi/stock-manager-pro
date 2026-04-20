import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockMovementDto } from './dto/stock-movement.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll(q: { search?: string; status?: string; categoryId?: string }) {
    const where: any = {};
    if (q.search) where.OR = [{ name: { contains: q.search } }, { sku: { contains: q.search } }];
    if (q.status === 'active') where.isActive = true;
    if (q.status === 'inactive') where.isActive = false;
    if (q.status === 'out_stock') where.quantity = 0;
    if (q.status === 'low_stock') where.quantity = { gt: 0, lte: 5 };
    if (q.categoryId) where.categoryId = +q.categoryId;
    return this.prisma.product.findMany({ where, include: { category: true }, orderBy: { createdAt: 'desc' } });
  }

  findOne(id: number) {
    return this.prisma.product.findUniqueOrThrow({ where: { id }, include: { category: true } });
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: dto, include: { category: true } });
  }

  update(id: number, dto: UpdateProductDto) {
    return this.prisma.product.update({ where: { id }, data: dto, include: { category: true } });
  }

  async updateStock(id: number, dto: StockMovementDto) {
    const product = await this.prisma.product.findUniqueOrThrow({ where: { id } });
    const newQty = dto.type === 'IN' ? product.quantity + dto.quantity
                  : dto.type === 'OUT' ? product.quantity - dto.quantity
                  : dto.quantity;
    const [updated] = await this.prisma.$transaction([
      this.prisma.product.update({ where: { id }, data: { quantity: newQty } }),
      this.prisma.stockMovement.create({ data: { type: dto.type, quantity: dto.quantity, reason: dto.reason, productId: id } }),
    ]);
    return updated;
  }

  getMovements(id: number) {
    return this.prisma.stockMovement.findMany({ where: { productId: id }, orderBy: { createdAt: 'desc' }, take: 50 });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
