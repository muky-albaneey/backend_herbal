import { Module } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { ProductImage } from 'src/user/entities/product_img.entity';
import { Product } from 'src/user/entities/product.entity';
import { UserService } from 'src/user/user.service';
import { MailService } from 'src/mail/mail.service';
import { ProfileImage } from 'src/user/entities/profile.entity';


@Module({
  imports:[ TypeOrmModule.forFeature([User, Product, ProductImage, ProfileImage])],
  providers: [ProductService, UserService, MailService],
  controllers: [ProductController]
})
export class ProductsModule {}
