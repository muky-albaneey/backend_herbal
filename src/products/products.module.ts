import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ProductImage } from 'src/user/entities/product_img.entity';
import { Product } from 'src/user/entities/product.entity';


@Module({
  imports:[ TypeOrmModule.forFeature([User, ProductImage, Product])],
  providers: [ProductService],
  controllers: [ProductController]
})
export class ProductsModule {}
