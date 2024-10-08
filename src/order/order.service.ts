import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from 'src/user/entities/order.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { CartItem } from 'src/user/entities/cart-item.entity';


@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async createOrder(createOrderDto: CreateOrderDto, userId): Promise<Order> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['address'], // Load the user's address if needed
    });
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Calculate total amount and delivery fee
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee = user.address?.country === 'Nigeria' ? 0 : 1000;
  
    // Create the order first
    const order = new Order();
    order.user = user;
    order.totalAmount = totalAmount;
    order.deliveryFee = deliveryFee;
  
    // Save the order to generate an order ID
    const savedOrder = await this.orderRepository.save(order);
  
    // Create CartItem instances with the order reference
    await Promise.all(
      createOrderDto.items.map(async (itemDto) => {
        const cartItem = new CartItem();
        cartItem.name = itemDto.name;
        cartItem.price = itemDto.price;
        cartItem.quantity = itemDto.quantity;
        cartItem.order = savedOrder; // Associate the cart item with the order
        return this.cartItemRepository.save(cartItem);
      })
    );
  
    // Load the saved order with its items
    const orderWithItems = await this.orderRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items'],
    });
  
    return orderWithItems; // This will return the order with the correct CartItem references
  }
  
  async getAllOrders(): Promise<Order[]> {
    return await this.orderRepository.find({
      relations: ['user', 'user.address', 'items'], // Load user, user's address, and cart items for each order
      order: {
        createdAt: 'DESC', // Adjust this to the actual field name for your created date
      },
    });
  }

  async getOrderById(orderId): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'user.address', 'items'], // Load user, user's address, and cart items for the order
    });
  
    if (!order) {
      throw new NotFoundException('Order not found');
    }
  
    return order;
  }
  

  async deleteOrderById(orderId): Promise<void> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepository.delete(orderId); // Delete the order
  }

  // Delete all orders
  async deleteAllOrders(): Promise<void> {
    await this.orderRepository.clear(); // This deletes all rows from the order table
  }

  async countOrders(): Promise<number> {
    return await this.orderRepository.count(); // Returns the total number of orders
  }
}
