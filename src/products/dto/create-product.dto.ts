import { IsIn, isIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";
import type { ProductType } from 'src/entities/product.entity';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsOptional()
    description?: string;
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price: number;
    @IsInt()
    @Min(0)
    stock: number;
    @IsInt()
    @IsPositive()
    categoryId: number;
    @IsIn(['physical','digital','service'])
    @IsOptional()
    type?: ProductType;
}