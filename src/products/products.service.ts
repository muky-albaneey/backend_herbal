
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import { Product } from 'src/user/entities/product.entity';
import { ProductImage } from 'src/user/entities/product_img.entity';
import { CreateProductDto } from 'src/user/dto/create-product.dto';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>,
  ) {}

  async createProductWithImage(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
    user: User,
  ) {
    const ext = path.extname(file.originalname).toLowerCase();
    const base64Image = file.buffer.toString('base64');

    const productImage = this.productImageRepository.create({
      name: file.originalname,
      base64: base64Image,
      ext: ext.slice(1),
      content: file.buffer,
    });

    const savedProductImage = await this.productImageRepository.save(productImage);

    // Create the product with reference to the user
    const newProduct = this.productRepository.create({
      ...createProductDto,
      product_image: savedProductImage,
      user,  // Associate product with user
    });

    return await this.productRepository.save(newProduct);
  }

  async findAllProducts() {
    const product = await this.productRepository.find({      
      relations: { product_image: true}     });
    return product
  }

  async deleteProduct(id): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findProductById(id): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

}
