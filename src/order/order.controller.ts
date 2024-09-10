import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req): Promise<any> {
    const user = req.user; // The authenticated user
    const order = await this.orderService.createOrder(createOrderDto, user);
    return order;
  }
}
