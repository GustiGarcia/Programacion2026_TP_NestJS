import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'src/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    private products: Product[] = [];
    private nextId = 1;

    create(dto: CreateProductDto) {
        const product: Product = {
            id: this.nextId++,
            ...dto,
            type: dto.type ?? 'physical',
        };
        this.products.push(product);
        return product;
    }

    findAll(minPrice?: number, maxPrice?: number) {
        return this.products.filter((p) => {
            const pasaMinimo = minPrice === undefined || p.price >= minPrice;
            const pasaMaximo = maxPrice === undefined || p.price <= maxPrice;
            return pasaMinimo && pasaMaximo;
        });
    }

    searchByName(name?: string) {
        if (name === undefined || name.trim() === '') {
            return this.products;
        }

        const buscado = name.toLowerCase();

        return this.products.filter((p) => p.name.toLowerCase().includes(buscado));
    }

    findByCategory(categoryId: number) {
        return this.products.filter((p) => p.categoryId === categoryId);
    }

    findOne(id: number) {
        const product = this.products.find((p) => p.id === id);

        if (!product) {
            throw new NotFoundException(`Producto con id ${id} no encontrado`);
        }

        return product;
    }

    update(id: number, dto: UpdateProductDto) {
        const product = this.findOne(id);

        Object.assign(product, dto);

        return product;
    }

    remove(id: number) {
        const index = this.products.findIndex((p) => p.id === id);

        if (index === -1) {
            throw new NotFoundException(`Producto con id ${id} no encontrado`);
        }

        const [deleted] = this.products.splice(index, 1);

        return deleted;
    }
}
