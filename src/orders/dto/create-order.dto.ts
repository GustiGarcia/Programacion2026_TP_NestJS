import { Type } from 'class-transformer';
import {
    ArrayNotEmpty,
    IsArray,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from 'class-validator';

export class OrderItemDto {
    @IsInt()
    @IsPositive()
    productId: number;

    @IsInt()
    @IsPositive()
    quantity: number;
}

export class CreateOrderDto {
    @IsString()
    @IsOptional()
    customerType?: string;

    @IsArray()
    @ArrayNotEmpty()
    // ValidateNested + Type son necesarios para que class-validator
    // valide cada objeto de adentro del array, y no solo el array.
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];
}