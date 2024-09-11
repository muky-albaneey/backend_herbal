// import { Injectable, BadRequestException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as path from 'path';
// import { Product } from 'src/user/entities/product.entity';
// import { ProductImage } from 'src/user/entities/product_img.entity';
// import { User } from 'src/user/entities/user.entity';
// import { CreateProductDto } from 'src/user/dto/create-product.dto';


// @Injectable()
// export class ProductService {
//   constructor(
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,
//     @InjectRepository(ProductImage)
//     private readonly productImageRepository: Repository<ProductImage>,
//     @InjectRepository(User)
//     private readonly userRepository: Repository<User>,
//   ) {}

//   async createProductWithImage(createProductDto: CreateProductDto, file: Express.Multer.File, userId: number): Promise<Product> {
//     const { name, price, quantity, category, description } = createProductDto;

//     // Convert file buffer to base64 string
//     const imageBase64 = file.buffer.toString('base64');
//     const imageExt = path.extname(file.originalname).toLowerCase().slice(1).trim();

//     // Find the user by userId
//     const user = await this.userRepository.findOne({ where: { id: userId } });
//     if (!user) {
//       throw new BadRequestException('User not found');
//     }

//     // Create new product image entity
//     const newProductImage = new ProductImage({
//       name: file.originalname,
//       content: file.buffer,
//       ext: imageExt,
//       base64: imageBase64,
//     });

//     // Save product image to the database
//     const savedImage = await this.productImageRepository.save(newProductImage);

//     // Create the product entity and link the image and user
//     const newProduct = new Product({
//       name,
//       price,
//       quantity,
//       category,
//       description,
//       product_image: savedImage, // Link the product image
//       user, // Link the user to the product
//     });

//     // Save the product with the image and user association
//     const savedProduct = await this.productRepository.save(newProduct);

//     return savedProduct;
//   }
// }
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Product } from './product.entity';
// import { ProductImage } from './product_img.entity';
import * as path from 'path';
import { Product } from 'src/user/entities/product.entity';
import { ProductImage } from 'src/user/entities/product_img.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async createProductWithImage(createProductDto: any, file: Express.Multer.File) {
    // Validate the image format
    const validImageFormats = ['.jpeg', '.png', '.gif', '.jpg'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!validImageFormats.includes(ext)) {
      throw new BadRequestException('Invalid image file format');
    }

    // Convert the image buffer to base64
    const base64Image = file.buffer.toString('base64');

    // Create the ProductImage entity
    const productImage = this.productImageRepository.create({
      name: file.originalname,
      base64: base64Image,
      ext: ext.slice(1), // Store the file extension (without the dot)
      content: file.buffer,
    });

    // Save the ProductImage to the database
    const savedProductImage = await this.productImageRepository.save(productImage);

    // Create the Product entity with the reference to ProductImage
    const newProduct = this.productRepository.create({
      ...createProductDto, // Spread the product details
      product_image: savedProductImage, // Link to the ProductImage entity
    });

    // Save the Product to the database
    return await this.productRepository.save(newProduct);
  }
}
