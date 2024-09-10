import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { Order } from './order.entity';
// import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from 'src/user/entities/order.entity';
import { OrderItem } from 'src/user/entities/order-item.entity';
import { User } from 'src/user/entities/user.entity';
// import { User } from './user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const { products, deliveryFee, totalAmount } = createOrderDto;

    const orderItems: OrderItem[] = [];

    // Process each product in the order
    for (const product of products) {
      const orderItem = new OrderItem({
        productName: product.productName,
        price: product.price,
        quantity: product.quantity,
        total: product.price * product.quantity,
      });
      orderItems.push(orderItem);
    }

    // Create and save the new order
    const order = new Order({
      user,
      items: orderItems,
      deliveryFee,
      totalAmount,
    });

    return await this.orderRepository.save(order);
  }
}
