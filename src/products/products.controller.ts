import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) {}

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    // GET /products?minPrice=...&maxPrice=...
    @Get()
    findAll(
        @Query('minPrice', new ParseIntPipe({ optional: true }))
        minPrice?: number,
        @Query('maxPrice', new ParseIntPipe({ optional: true }))
        maxPrice?: number,
    ) {
        return this.productService.findAll(minPrice, maxPrice);
    }

    // GET /products/search?name=...
    // Debe declararse ANTES de @Get(':id'), si no ':id' captura la palabra "search".
    @Get('search')
    searchByName(@Query('name') name?: string) {
        return this.productService.searchByName(name);
    }

    // GET /products/category/:categoryId
    @Get('category/:categoryId')
    findByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
        return this.productService.findByCategory(categoryId);
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.productService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return this.productService.update(id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.productService.remove(id);
    }
}
