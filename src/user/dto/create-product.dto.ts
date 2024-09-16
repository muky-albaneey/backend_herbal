// import { IsNotEmpty, IsString } from 'class-validator';

// export class CreateProductDto {
//   @IsNotEmpty()
//   @IsString()
//   name: string;

//   @IsNotEmpty()
//   @IsString()
//   price: string;

//   @IsNotEmpty()
//   @IsString()
//   quantity: string;

//   @IsNotEmpty()
//   @IsString()
//   category: string;

//   @IsNotEmpty()
//   @IsString()
//   description: string;
// }
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsNotEmpty()
  @IsString()
  quantity: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  // Add userId to link product to a user
  @IsNotEmpty()
  @IsString() // or @IsUUID() if you're using UUIDs
  userId: number; // Assuming userId is a string/UUID
}
