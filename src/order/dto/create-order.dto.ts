import { IsArray, IsDecimal, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  products: {
    productName: string;
    price: number;
    quantity: number;
  }[];

  @IsDecimal()
  @IsNotEmpty()
  deliveryFee: number;

  @IsDecimal()
  @IsNotEmpty()
  totalAmount: number; // Total price, including delivery fee
}
