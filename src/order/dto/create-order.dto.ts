// create-order.dto.ts
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsArray() // Ensure that the items are an array
  @IsNotEmpty()
  items: CartItemDto[]; // Array of cart items

  // You can add other fields here if necessary, e.g., totalAmount
}

export class CartItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
