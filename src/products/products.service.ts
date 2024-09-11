
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Product } from './product.entity';
// import { ProductImage } from './product_img.entity';
import * as path from 'path';
import { Product } from 'src/user/entities/product.entity';
import { ProductImage } from 'src/user/entities/product_img.entity';
import { CreateProductDto } from 'src/user/dto/create-product.dto';
import { User } from 'src/user/entities/user.entity';



// @Injectable()
// export class ProductService {
//   constructor(
//     @InjectRepository(Product)
//     private readonly productRepository: Repository<Product>,
//     @InjectRepository(ProductImage)
//     private readonly productImageRepository: Repository<ProductImage>,
//   ) {}

//   async createProductWithImage(createProductDto: any, file: Express.Multer.File) {
//     // Validate the image format
//     const validImageFormats = ['.jpeg', '.png', '.gif', '.jpg'];
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (!validImageFormats.includes(ext)) {
//       throw new BadRequestException('Invalid image file format');
//     }

//     // Convert the image buffer to base64
//     const base64Image = file.buffer.toString('base64');

//     // Create the ProductImage entity
//     const productImage = this.productImageRepository.create({
//       name: file.originalname,
//       base64: base64Image,
//       ext: ext.slice(1), // Store the file extension (without the dot)
//       content: file.buffer,
//     });

//     // Save the ProductImage to the database
//     const savedProductImage = await this.productImageRepository.save(productImage);

//     // Create the Product entity with the reference to ProductImage
//     const newProduct = this.productRepository.create({
//       ...createProductDto, // Spread the product details
//       product_image: savedProductImage, // Link to the ProductImage entity
//     });

//     // Save the Product to the database
//     return await this.productRepository.save(newProduct);
//   }
// }
@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,  // Inject UserRepository
  ) {}

  async createProductWithImage(createProductDto: CreateProductDto, file: Express.Multer.File) {
    const { userId, name, price, quantity, category, description } = createProductDto;

    // Fetch the user by userId
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Validate the image format
    const ext = path.extname(file.originalname).toLowerCase();
    const validImageFormats = ['.jpeg', '.png', '.gif', '.jpg'];
    if (!validImageFormats.includes(ext)) {
      throw new BadRequestException('Invalid image file format');
    }

    // Convert the image buffer to base64
    const base64Image = file.buffer.toString('base64');

    // Create the ProductImage entity
    const productImage = this.productImageRepository.create({
      name: file.originalname,
      base64: base64Image,
      ext: ext.slice(1),
      content: file.buffer,
    });

    // Save the ProductImage entity
    const savedProductImage = await this.productImageRepository.save(productImage);

    // Create the Product entity and link to the user
    const newProduct = this.productRepository.create({
      name,
      price,
      quantity,
      category,
      description,
      product_image: savedProductImage,
      user,  // Associate the user with the product
    });

    // Save the Product to the database
    return await this.productRepository.save(newProduct);
  }
}
