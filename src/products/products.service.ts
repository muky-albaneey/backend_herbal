
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as path from 'path';
import { Product } from 'src/user/entities/product.entity';
import { ProductImage } from 'src/user/entities/product_img.entity';
import { CreateProductDto } from 'src/user/dto/create-product.dto';
import { User } from 'src/user/entities/user.entity';
import * as AWS from 'aws-sdk';

@Injectable()
export class ProductService {
  private s3: AWS.S3;
  private bucketName: string;
  constructor(
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(ProductImage) private productImageRepository: Repository<ProductImage>,
  ) {
   
    // this.bucketName = process.env.LINODE_BUCKET_NAME; // Set bucket name
    this.s3 = new AWS.S3({
      endpoint: process.env.LINODE_BUCKET_ENDPOINT, // Linode bucket endpoint
      accessKeyId: process.env.LINODE_ACCESS_KEY, // Access key
      secretAccessKey: process.env.LINODE_SECRET_KEY, // Secret key
      region: process.env.LINODE_BUCKET_REGION, // Bucket region
      s3ForcePathStyle: true, // Linode-specific setting
    });
    this.bucketName = process.env.LINODE_BUCKET_NAME; // Set bucket name
  }


  async uploadFileToLinode(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: `${Date.now()}-${file.originalname}`, // Unique filename
      Body: file.buffer, // File content
      ContentType: file.mimetype, // Set content type (e.g., image/jpeg)
      ACL: 'public-read', // Make the file publicly accessible
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      return uploadResult.Location; // Return the URL of the uploaded file
    } catch (error) {
      throw new BadRequestException('Error uploading file to Linode Object Storage');
    }
  }

  // Create product with image
  async createProductWithImage(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
    user: User,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Upload file to Linode Object Storage and get the URL
    const fileUrl = await this.uploadFileToLinode(file);

    // Save product image in the database
    const productImage = this.productImageRepository.create({
      name: file.originalname,
      url: fileUrl, // Store the file URL in the database
      ext: path.extname(file.originalname).slice(1),
    });
    
    const savedProductImage = await this.productImageRepository.save(productImage);

    // Create the product with the saved image and associated user
    const newProduct = this.productRepository.create({
      ...createProductDto,
      product_image: savedProductImage,
      user, // Associate product with the user
    });

    return await this.productRepository.save(newProduct);
  }

  async findAllProducts() {
    const product = await this.productRepository.find({      
      relations: { product_image: true} });
    return product
  }

  async findAllProductsDes() {
    const product = await this.productRepository.find({
      relations: { product_image: true },
      order: { id: 'DESC' }, // Order by descending id to get the latest product
      take: 1,               // Limit to 1 to fetch the last product
    });
    return product; // Return the single product
  }
  
  async deleteProduct(id): Promise<void> {
    const result = await this.productRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async findProductById(id): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['product_image', 'user'],  // Include 'user' relation
    });
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
    file?: Express.Multer.File,
  ): Promise<Product> {
    // Find the product by ID
    const product = await this.productRepository.findOne({ where: { id }, relations: { product_image: true } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Update product details with the provided fields
    Object.assign(product, updateProductDto);

    // If a new file is provided, upload to S3 and update the image URL
    if (file) {
      const fileUrl = await this.uploadFileToLinode(file);
      
      const productImage = this.productImageRepository.create({
        name: file.originalname,
        url: fileUrl, // Save the S3 URL
        ext: path.extname(file.originalname).slice(1),
      });

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

  async deleteAllProducts(): Promise<void> {
    const products = await this.productRepository.find({
      relations: { product_image: true },
    });
  
    if (products.length === 0) {
      throw new NotFoundException('No products found to delete');
    }
  
    // Delete each product and its associated image
    for (const product of products) {
      if (product.product_image) {
        // Delete the associated image from Linode (optional step)
        try {
          const deleteParams = {
            Bucket: this.bucketName,
            Key: path.basename(product.product_image.url), // Extract the key from the image URL
          };
          await this.s3.deleteObject(deleteParams).promise();
        } catch (error) {
          console.error(`Error deleting image from Linode: ${error.message}`);
        }
  
        // Delete the image from the database
        await this.productImageRepository.delete(product.product_image.id);
      }
  
      // Delete the product itself
      await this.productRepository.delete(product.id);
    }
  }
  async deleteProductById(id): Promise<void> {
    // Find the product by id with its associated image
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { product_image: true },
    });
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    // If the product has an associated image, delete it from Linode Object Storage (optional)
    if (product.product_image) {
      try {
        const deleteParams = {
          Bucket: this.bucketName,
          Key: path.basename(product.product_image.url), // Extract the key from the image URL
        };
        await this.s3.deleteObject(deleteParams).promise();
      } catch (error) {
        console.error(`Error deleting image from Linode: ${error.message}`);
      }
  
      // Delete the image from the database
      await this.productImageRepository.delete(product.product_image.id);
    }
  
    // Delete the product itself
    const result = await this.productRepository.delete(id);
  
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
  
  
}
