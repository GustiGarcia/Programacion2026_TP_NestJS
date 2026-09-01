export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export class OrderItem {
    productId: number;
    quantity: number;
    // Se copia el precio del producto al momento de crear el pedido.
    // Si el producto cambia de precio, el pedido conserva el precio original.
    unitPrice: number;
    subtotal: number;
}

export class Order {
    id: number;
    customerType: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    total: number;
    status: OrderStatus;
}