import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll() { return this.prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { name: 'asc' } }); }
  findOne(id: number) { return this.prisma.category.findUniqueOrThrow({ where: { id } }); }
  create(dto: CreateCategoryDto) { return this.prisma.category.create({ data: dto }); }
  update(id: number, dto: UpdateCategoryDto) { return this.prisma.category.update({ where: { id }, data: dto }); }
  remove(id: number) { return this.prisma.category.delete({ where: { id } }); }
}
