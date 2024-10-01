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
  

  
  
  // async createOrder(createOrderDto: CreateOrderDto, userId): Promise<Order> {
  //   // Fetch the user to attach to the order
  //   const user = await this.userRepository.findOne({
  //     where: { id: userId },
  //     relations: ['address'], // Load the user's address
  //   });
  
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  
  //   // Calculate totalAmount and deliveryFee based on the user's address
  //   const totalAmount = createOrderDto.items.reduce(
  //     (sum, item) => sum + item.price * item.quantity,
  //     0
  //   );
  //   const deliveryFee = user.address?.country === 'Nigeria' ? 0 : 1000; // Example delivery fee
  
  //   // Create and save CartItem instances before saving the order
  //   const cartItems = await Promise.all(
  //     createOrderDto.items.map(async (itemDto) => {
  //       const cartItem = new CartItem();
  //       cartItem.name = itemDto.name;
  //       cartItem.price = itemDto.price;
  //       cartItem.quantity = itemDto.quantity;
  //       return this.cartItemRepository.save(cartItem); // Save each CartItem to the database
  //     })
  //   );
  
  //   // Now create the order and associate it with cartItems and the user
  //   const order = new Order();
  //   order.user = user; // Attach user to the order
  //   order.totalAmount = totalAmount; // Set total amount
  //   order.deliveryFee = deliveryFee; // Set delivery fee
  //   order.items = cartItems; // Attach the saved cart items to the order
  
  //   // Save the order with its items
  //   return await this.orderRepository.save(order);
  // }
  
}
