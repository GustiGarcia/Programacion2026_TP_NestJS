import { isIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";

import { ProductType } from "src/entities/product.entity";
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
    @isIn(['physical','digital','service'])
    @IsOptional()
    type: ProductType;
}