import { Controller, Post, Body, Param, ParseUUIDPipe, Res, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { Response } from 'express';


@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':id')
  async createOrder(@Body() createOrderDto, @Param('id', ParseUUIDPipe) id: string, @Res({ passthrough: true }) response: Response) {
    console.log(createOrderDto)
    // return createOrderDto
    const result = this.orderService.createOrder(createOrderDto, id);

    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: ' address info',
      data: result,
    
    });
  }
}
