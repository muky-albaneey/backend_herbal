
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
      // content: file.buffer,
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
      relations: { product_image: true} });
    return product
  }

  async deleteProduct(id): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findProductById(id): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id }, relations: { product_image: true}  });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

    async countAllProducts(): Promise<number> {
      return await this.productRepository.count();
    }

  async patchProductWithImage(
    id,
    updateProductDto: Partial<CreateProductDto>,
    file?: Express.Multer.File
  ): Promise<Product> {
    // Find the product by ID
    const product = await this.productRepository.findOne({ where: { id }, relations: { product_image: true } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    // Update product details with the provided fields
    Object.assign(product, updateProductDto);
  
    // If a new file is provided, update the image
    if (file) {
      const ext = path.extname(file.originalname).toLowerCase();
      const base64Image = file.buffer.toString('base64');
  
      const productImage = this.productImageRepository.create({
        name: file.originalname,
        base64: base64Image,
        ext: ext.slice(1),
        // content: file.buffer,
      });
  
      // Save the new image
      const savedProductImage = await this.productImageRepository.save(productImage);
      product.product_image = savedProductImage;
    }
  
    // Save the updated product
    return await this.productRepository.save(product);
  }
  
  async findProductsByCategory(category: string): Promise<Product[]> {
    const products = await this.productRepository.find({
      where: { category },
      relations: { product_image: true },
    });

    if (!products || products.length === 0) {
      throw new NotFoundException(`No products found for category: ${category}`);
    }

    return products;
  }
  
  async findFirstTenProducts() {
    const products = await this.productRepository.find({
      take: 10, // Limits the result to the first 10 products
      relations: { product_image: true },
    });

    return products;
  }
  async findMiddleSevenProducts() {
    // Get the total number of products
    const totalProducts = await this.productRepository.count();

    if (totalProducts < 7) {
      throw new NotFoundException('Not enough products to retrieve the middle seven');
    }

    // Calculate the starting index for the middle seven products
    const middleIndex = Math.floor(totalProducts / 2) - Math.floor(7 / 2);
    const offset = Math.max(0, middleIndex); // Ensure offset doesn't go below 0

    // Retrieve the middle seven products
    const products = await this.productRepository.find({
      skip: offset,  // Skip the products before the middle index
      take: 7,  // Take the next 7 products
      order: { createdAt: 'ASC' },  // Order by creation date, oldest first
      relations: { product_image: true },  // Fetch related product images
    });

    return products;
  }
  async findLastTenProducts() {
    const products = await this.productRepository.find({
      order: { createdAt: 'DESC' },  // Order by creation date, newest first
      take: 10,  // Limit the result to 10 products
      relations: { product_image: true },  // Fetch related product images
    });

    if (!products || products.length === 0) {
      throw new NotFoundException('No products found');
    }

    return products;
  }
  
}
