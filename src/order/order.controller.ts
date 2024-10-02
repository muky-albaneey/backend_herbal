import { Controller, Post, Body, Param, ParseUUIDPipe, Res, HttpStatus, Get, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import type { Response } from 'express';
import { Order } from 'src/user/entities/order.entity';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post(':id')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto, // Specify DTO
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const result = await this.orderService.createOrder(createOrderDto, id); // await the service call
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order created successfully',
        data: result,
      });
    } catch (error) {
      console.error('Error creating order:', error);  // Log the error details
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to create order',
        error: error.message,
      });
    }
  }

  @Get()
  async findAll(): Promise<Order[]> {
    return await this.orderService.getAllOrders();
  }

  @Get(':id')
  async getOrder(@Param('id') id: string): Promise<Order> {
    return this.orderService.getOrderById(id);
  }
  
  @Delete(':id')
  async deleteOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      await this.orderService.deleteOrderById(id);
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Order deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting order:', error);  // Log the error details
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to delete order',
        error: error.message,
      });
    }
  }

  // Delete all orders
  @Delete()
  async deleteAllOrders(@Res({ passthrough: true }) response: Response) {
    try {
      await this.orderService.deleteAllOrders();
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'All orders deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting all orders:', error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to delete all orders',
        error: error.message,
      });
    }
  }
}
