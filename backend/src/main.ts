import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true },
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  await app.listen(process.env.PORT || 3001);
  console.log(`\n   🚀 StockManager API running on http://localhost:${process.env.PORT || 3001}/api\n`);
}
bootstrap();
