
export type ProductType = 'physical' | 'digital' | 'service';

export class Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  categoryId: number;
  type: ProductType;
}