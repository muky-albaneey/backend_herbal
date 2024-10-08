import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseUUIDPipe,
  Get,
  UseGuards,
  Req,
  Delete,
  HttpCode,
  Param,
  HttpStatus,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { ProductService } from './products.service';
import { CreateProductDto } from 'src/user/dto/create-product.dto';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express'; // Import Request
import { Product } from 'src/user/entities/product.entity';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly userService: UserService,
  ) {}

  // @UseGuards(JwtGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (!['.jpeg', '.jpg', '.png', '.gif'].includes(ext)) {
          return callback(new BadRequestException('Invalid image file format'), false);
        }
        callback(null, true);
      },
    }),
  )
  async createProduct(
    @UploadedFile() file: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const userId = createProductDto.userId; // Assuming userId is in the DTO
    const user = await this.userService.findOne(userId); // Fetch the user from the UserService
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Delegate product creation to the service
    return this.productService.createProductWithImage(createProductDto, file, user);
  }
  @Get('all')
  async findAll() {
    return await this.productService.findAllProducts();
  }

  @Get('all/desc')
  async findAllDesc() {
    return await this.productService.findAllProductsDes();
  }

     // Access Key
    // ZN4YYP732QAAGQVLAWSD

    // Secret Key
    // AGnMDoetFFTEEL19xf0HrHDcp7K4lZejdidiMsKY
    
  @Get('count')
  async countAllProducts() {
    return await this.productService.countAllProducts();
  }
  @Get('first-ten')
  async getFirstTenProducts() {
    return this.productService.findFirstTenProducts();
  }

  @Get('middle-seven')
  async getMiddleSevenProducts() {
    return await this.productService.findMiddleSevenProducts();
  }

  @Get('last-ten')
  async getLastTenProducts() {
    return await this.productService.findLastTenProducts();
  }


  @Get('category/:category')
  async getProductsByCategory(@Param('category') category: string) {
    return this.productService.findProductsByCategory(category);
  }

  @Get(':id')
  async findProductById(@Param('id') id: string): Promise<Product> {
    const product = await this.productService.findProductById(id);
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }  

@Patch(':id')
@UseInterceptors(
  FileInterceptor('file', {
    fileFilter: (req, file, callback) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (!['.jpeg', '.jpg', '.png', '.gif'].includes(ext)) {
        return callback(new BadRequestException('Invalid image file format'), false);
      }
      callback(null, true);
    },
  }),
)
async patchProduct(
  @Param('id') id: string,
  @UploadedFile() file: Express.Multer.File,
  @Body() updateProductDto: Partial<CreateProductDto>,
) {
  return await this.productService.patchProductWithImage(id, updateProductDto, file);
}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Sets the response status to 204 No Content
  async deleteProduct(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
  }
}
