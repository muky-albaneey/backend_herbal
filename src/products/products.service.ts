import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import { Product } from 'src/user/entities/product.entity';
import { ProductImage } from 'src/user/entities/product_img.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateProductDto } from 'src/user/dto/create-product.dto';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createProductWithImage(createProductDto: CreateProductDto, file: Express.Multer.File, userId: number): Promise<Product> {
    const { name, price, quantity, category, description } = createProductDto;

    // Convert file buffer to base64 string
    const imageBase64 = file.buffer.toString('base64');
    const imageExt = path.extname(file.originalname).toLowerCase().slice(1).trim();

    // Find the user by userId
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Create new product image entity
    const newProductImage = new ProductImage({
      name: file.originalname,
      content: file.buffer,
      ext: imageExt,
      base64: imageBase64,
    });

    // Save product image to the database
    const savedImage = await this.productImageRepository.save(newProductImage);

    // Create the product entity and link the image and user
    const newProduct = new Product({
      name,
      price,
      quantity,
      category,
      description,
      product_image: savedImage, // Link the product image
      user, // Link the user to the product
    });

    // Save the product with the image and user association
    const savedProduct = await this.productRepository.save(newProduct);

    return savedProduct;
  }
}
