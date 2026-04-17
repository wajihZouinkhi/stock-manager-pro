import { Controller, Get, Post, Put, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockMovementDto } from './dto/stock-movement.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}
  @Get() findAll(@Query() q: { search?: string; status?: string; categoryId?: string }) { return this.service.findAll(q); }
  @Get(':id') findOne(@Param('id', ParseIntPipe) id: number) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateProductDto) { return this.service.create(dto); }
  @Put(':id') update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) { return this.service.update(id, dto); }
  @Patch(':id/stock') updateStock(@Param('id', ParseIntPipe) id: number, @Body() dto: StockMovementDto) { return this.service.updateStock(id, dto); }
  @Get(':id/movements') getMovements(@Param('id', ParseIntPipe) id: number) { return this.service.getMovements(id); }
  @Delete(':id') remove(@Param('id', ParseIntPipe) id: number) { return this.service.remove(id); }
}
