import {
  Controller,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { ProductService } from './products.service';
import { CreateProductDto } from 'src/user/dto/create-product.dto';

// @Controller('products')
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   @Post()
//   @UseInterceptors(
//     FileInterceptor('file', {
//       fileFilter: (req, file, callback) => {
//         const ext = path.extname(file.originalname).toLowerCase();
//         if (!['.jpeg', '.jpg', '.png', '.gif'].includes(ext)) {
//           return callback(new BadRequestException('Invalid image file format'), false);
//         }
//         callback(null, true);
//       },
//     }),
//   )
//   async createProduct(
//     @UploadedFile() file: Express.Multer.File, // Handling the uploaded file
//     @Body() createProductDto: CreateProductDto, // The rest of the product details
//   ) {
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     // Pass the product details and file to the service
//     return await this.productService.createProductWithImage(createProductDto, file);
//   }
// }
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

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

    // Call the service to create the product with the associated image and user
    return await this.productService.createProductWithImage(createProductDto, file);
  }
}
