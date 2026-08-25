import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [ProductsModule, CategoriesModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
})
export class AppModule {}
