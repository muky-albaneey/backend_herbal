// import {
//   Controller,
//   Post,
//   Body,
//   UploadedFile,
//   UseInterceptors,
//   BadRequestException,
//   ParseUUIDPipe,
//   Get,
//   UseGuards,
//   Req,
// } from '@nestjs/common';
// import { FileInterceptor } from '@nestjs/platform-express';
// import * as path from 'path';
// import { ProductService } from './products.service';
// import { CreateProductDto } from 'src/user/dto/create-product.dto';
// import { UserService } from 'src/user/user.service';
// import { JwtGuard } from 'src/guards/jwt.guard';
// import { Request } from 'express';

// @Controller('products')
// export class ProductController {
//   constructor(
//     private readonly productService: ProductService,
//     private readonly userService: UserService,
//   ) {}

//   @UseGuards(JwtGuard)
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
//     @UploadedFile() file: Express.Multer.File,
//     @Body() createProductDto: CreateProductDto,
//     @Req() req: Request 
//   ) {
//     if (!file) {
//       throw new BadRequestException('Image file is required');
//     }

//     // Find the user using the userId from the form
//     // const user = await this.userService.findOne(createProductDto.userId);
//     // if (!user) {
//     //   throw new BadRequestException('User not found');
//     // }
//     const userId = req['userId']; // Access the userId from the request
//     const user = await this.userService.findOne(userId);
//     if (!user) {
//       throw new BadRequestException('User not found');
//     }

//     // Call the service to create the product and link it to the user
//     return await this.productService.createProductWithImage(createProductDto, file, user);
//   }


//   @Get('all')
//   async findAll() {
//       return await this.productService.findAllProducts();
//     }
// }

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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import { ProductService } from './products.service';
import { CreateProductDto } from 'src/user/dto/create-product.dto';
import { UserService } from 'src/user/user.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Request } from 'express'; // Import Request

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
    // @Req() req: Request // Access the request object
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const userId = createProductDto.userId // Access the userId from the request
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Call the service to create the product and link it to the user
    return await this.productService.createProductWithImage(createProductDto, file, user);
  }

  @Get('all')
  async findAll() {
    return await this.productService.findAllProducts();
  }
}
