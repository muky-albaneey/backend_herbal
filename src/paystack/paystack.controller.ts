import { Controller, Post, Body, Req, Res, Headers, Get, Query } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';

@Controller('paystack')
export class PaystackController {
  constructor(private readonly paystackService: PaystackService) {}


// Modify the initializePayment function to accept currency
@Post('initialize')
async initializePayment(
  @Body('email') email: string,
  @Body('amount') amount: number,
  @Body('currency') currency: string, // Add currency to the body
  @Body('callback_url') callback_url: string, // Accept callback_url in the request body
  @Body() createOrderDto: CreateOrderDto
) {
  try {
    // Call service with the currency included
    const response = await this.paystackService.initializePayment(email, amount, currency, callback_url,createOrderDto);
    return { status: 'success', data: response };
  } catch (error) {
    return { status: 'error', message: error.message };
  }
}

  // Webhook handler
  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const secret = 'sk_test_c1e0adc5d2721ff5ed3a8c1a7dcd3f6c6f8a9902'; // Same secret key used for the Paystack service
    const payload = JSON.stringify(req.body);

    // Verify the webhook signature
    const hash = crypto.createHmac('sha512', secret).update(payload).digest('hex');
    if (hash === signature) {
      const event = req.body;

      // Log the event for debugging
      // console.log('Received Paystack webhook event:', event);

      // Handle specific events like payment success
      switch (event.event) {
        case 'charge.success':
          const paymentData = event.data;
          console.log('Payment successful:', paymentData);

          // TODO: Update your order status or perform other actions based on the payment data
          break;

        default:
          console.log(`Unhandled event type: ${event.event}`);
      }

      return res.status(200).send('Webhook received successfully');
    } else {
      // console.error('Invalid Paystack webhook signature');
      return res.status(400).send('Invalid signature');
    }
  }
  @Get('verify-payment')
  async verifyPayment(@Query('reference') reference: string) {
    console.log('Received reference for verification:', reference);
    try {
      const response = await this.paystackService.verifyPayment(reference);
      return { status: 'success', data: response };
    } catch (error) {
      // console.error('Payment verification error:', error.message);
      return { status: 'error', message: error.message };
    }
  }
  
}
