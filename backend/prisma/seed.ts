import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const electronique = await prisma.category.upsert({
    where: { name: 'Électronique' },
    update: {},
    create: { name: 'Électronique', color: '#6366f1', icon: 'Cpu' },
  });
  const vetements = await prisma.category.upsert({
    where: { name: 'Vêtements' },
    update: {},
    create: { name: 'Vêtements', color: '#ec4899', icon: 'Shirt' },
  });
  const alimentation = await prisma.category.upsert({
    where: { name: 'Alimentation' },
    update: {},
    create: { name: 'Alimentation', color: '#22c55e', icon: 'ShoppingBasket' },
  });

  await prisma.product.upsert({
    where: { sku: 'ELEC-001' },
    update: {},
    create: { name: 'iPhone 15 Pro', sku: 'ELEC-001', price: 1299, costPrice: 920, quantity: 15, minQuantity: 5, categoryId: electronique.id },
  });
  await prisma.product.upsert({
    where: { sku: 'ELEC-002' },
    update: {},
    create: { name: 'MacBook Pro 14"', sku: 'ELEC-002', price: 2199, costPrice: 1600, quantity: 3, minQuantity: 2, categoryId: electronique.id },
  });
  await prisma.product.upsert({
    where: { sku: 'VET-001' },
    update: {},
    create: { name: 'T-Shirt Premium', sku: 'VET-001', price: 29,99, costPrice: 8, quantity: 5, minQuantity: 10, categoryId: vetements.id },
  });
  await prisma.product.upsert({
    where: { sku: 'ALIM-001' },
    update: {},
    create: { name: 'Café Organique 1 kg', sku: 'ALIM-001', price: 18, costPrice: 9, quantity: 0, minQuantity: 5, unit: 'kg', categoryId: alimentation.id },
  });
  console.log('📥 Seed ok!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
