import { Injectable, NotFoundException } from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    private categories: Category[] = [];
    private nextId = 1;

    create(dto: CreateCategoryDto) {
        const category: Category = {
            id: this.nextId++,
            ...dto,
        };
        this.categories.push(category);
        return category;
    }

    findAll() {
        return this.categories;
    }

    findOne(id: number) {
        const category = this.categories.find((c) => c.id === id);

        if (!category) {
            throw new NotFoundException(`Categoría con id ${id} no encontrada`);
        }

        return category;
    }

    update(id: number, dto: UpdateCategoryDto) {
        const category = this.findOne(id);

        Object.assign(category, dto);

        return category;
    }

    remove(id: number) {
        const index = this.categories.findIndex((c) => c.id === id);

        if (index === -1) {
            throw new NotFoundException(`Categoría con id ${id} no encontrada`);
        }

        const [deleted] = this.categories.splice(index, 1);

        return deleted;
    }
}