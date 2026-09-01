import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { ProductsModule } from '../products/products.module';

@Module({
    // Importar ProductsModule habilita la inyección de ProductsService
    // dentro de OrdersService.
    imports: [ProductsModule],
    controllers: [OrdersController],
    providers: [OrdersService],
})
export class OrdersModule {}