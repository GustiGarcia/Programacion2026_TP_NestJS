import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Order, OrderItem } from 'src/entities/order.entity';
import { ProductsService } from '../products/products.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    private orders: Order[] = [];
    private nextId = 1;

    // ProductsService se inyecta gracias a que ProductsModule lo exporta
    // y OrdersModule lo importa.
    constructor(private readonly productsService: ProductsService) {}

    create(dto: CreateOrderDto) {
        const items: OrderItem[] = [];

        for (const item of dto.items) {
            // findOne lanza NotFoundException si el producto no existe.
            const product = this.productsService.findOne(item.productId);

            if (product.stock < item.quantity) {
                throw new BadRequestException(
                    `Stock insuficiente para "${product.name}": disponible ${product.stock}, solicitado ${item.quantity}`,
                );
            }

            items.push({
                productId: product.id,
                quantity: item.quantity,
                unitPrice: product.price,
                subtotal: product.price * item.quantity,
            });
        }

        // El stock se descuenta recién cuando todos los ítems son válidos,
        // para no dejar el pedido a medias si uno falla.
        for (const item of items) {
            const product = this.productsService.findOne(item.productId);
            product.stock -= item.quantity;
        }

        const subtotal = items.reduce((acc, item) => acc + item.subtotal, 0);

        const order: Order = {
            id: this.nextId++,
            customerType: dto.customerType ?? 'regular',
            items,
            subtotal,
            // El descuento se calculará con el patrón Strategy (Parte 2).
            discount: 0,
            total: subtotal,
            status: 'pending',
        };

        this.orders.push(order);
        return order;
    }

    findAll() {
        return this.orders;
    }

    findOne(id: number) {
        const order = this.orders.find((o) => o.id === id);

        if (!order) {
            throw new NotFoundException(`Pedido con id ${id} no encontrado`);
        }

        return order;
    }

    update(id: number, dto: UpdateOrderDto) {
        const order = this.findOne(id);

        if (dto.customerType !== undefined) {
            order.customerType = dto.customerType;
        }

        return order;
    }

    remove(id: number) {
        const index = this.orders.findIndex((o) => o.id === id);

        if (index === -1) {
            throw new NotFoundException(`Pedido con id ${id} no encontrado`);
        }

        const [deleted] = this.orders.splice(index, 1);

        // Al cancelar el pedido se devuelve el stock a los productos.
        for (const item of deleted.items) {
            const product = this.productsService.findOne(item.productId);
            product.stock += item.quantity;
        }

        return deleted;
    }
}