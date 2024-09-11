// import { Controller, Post, Body, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// // import { ProductService } from './product.service';
// // import { CreateProductDto } from './dto/create-product.dto';
// import { diskStorage } from 'multer';
// import * as path from 'path';
// import { ProductService } from './products.service';
// import { CreateProductDto } from 'src/user/dto/create-product.dto';



// @Controller('products')
// export class ProductController {
//   constructor(private readonly productService: ProductService) {}

//   @Post()
//   @UseInterceptors(
//     FileInterceptor('file', {
//       storage: diskStorage({
//         destination: './uploads', // directory to save uploaded images
//         filename: (req, file, callback) => {
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           const ext = path.extname(file.originalname);
//           const fileName = `${file.fieldname}-${uniqueSuffix}${ext}`;
//           callback(null, fileName);
//         },
//       }),
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

//     // Assume userId comes in the createProductDto
//     const { userId } = createProductDto;

//     // Pass the product details, file, and userId to the service
//     return await this.productService.createProductWithImage(createProductDto, file, userId);
//   }
// }

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
    @UploadedFile() file: Express.Multer.File, // Handling the uploaded file
    @Body() createProductDto: CreateProductDto, // The rest of the product details
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    // Pass the product details and file to the service
    return await this.productService.createProductWithImage(createProductDto, file);
  }
}
