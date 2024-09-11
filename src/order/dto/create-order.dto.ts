interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
  }
  
  export class CreateOrderDto {
    userId: number;
    items: CartItem[]; // Cart items passed from the frontend
    deliveryFee: number; // Delivery fee
  }
  