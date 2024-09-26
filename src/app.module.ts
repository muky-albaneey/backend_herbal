import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService,  } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { MailService } from './mail/mail.service';
import { ProfileImage } from './user/entities/profile.entity';
import { PaystackModule } from './paystack/paystack.module';
import { ProductsModule } from './products/products.module';
import { ProductImage } from './user/entities/product_img.entity';
import { Product } from './user/entities/product.entity';
import { OrderModule } from './order/order.module';
import { Order } from './user/entities/order.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // host:  configService.get<string>('DATABASE_DEV_HOST'),
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User,  ProductImage, Product, ProfileImage, Order],
        synchronize: true, 
        ssl: {
          rejectUnauthorized: false,
        },
        migrations: ['src/migrations/*.ts'],
      }),
    }),
    UserModule,
    PaystackModule,
    ProductsModule,
    OrderModule 

  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}