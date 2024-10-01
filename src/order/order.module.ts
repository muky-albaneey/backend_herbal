import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/user/entities/order.entity';
import { CartItem } from 'src/user/entities/cart-item.entity';
import { Address } from 'src/user/entities/address.entity';

@Module({
  imports : [TypeOrmModule.forFeature([User, Order,CartItem , Address])],
  providers: [OrderService],
  controllers: [OrderController]
})
export class OrderModule {}
