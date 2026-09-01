import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    // Necesario para que OrdersService pueda inyectar ProductsService.
    exports: [ProductsService],
})
export class ProductsModule {}