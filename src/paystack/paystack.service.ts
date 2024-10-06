import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as https from 'https';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';

@Injectable()
export class PaystackService {
  private readonly secretKey = 'sk_test_c1e0adc5d2721ff5ed3a8c1a7dcd3f6c6f8a9902'; // Replace with your Paystack secret key



// // Helper function to convert amount to the smallest unit based on the currency
private convertAmount(amount: number, currency: string): number {
  switch (currency.toUpperCase()) {
    case 'NGN': // Naira, amount should be in kobo (1 NGN = 100 kobo)
      return amount * 100;
    case 'USD': // Dollar, amount should be in cents (1 USD = 100 cents)
      return amount * 100;
    case 'GHS': // Ghanaian cedi, amount should be in pesewas (1 GHS = 100 pesewas)
      return amount * 100;
    case 'KES': // Kenyan shilling, amount should be in cents (1 KES = 100 cents)
      return amount * 100;
    default:
      throw new HttpException(`Unsupported currency: ${currency}`, HttpStatus.BAD_REQUEST);
  }
}
async initializePayment(
  email: string,
  amount: number,
  currency: string,
  callback_url: string,
  createOrderDto: CreateOrderDto,
): Promise<any> {
  // Build the metadata with custom fields for product details
  const metadata = {
    message: 'Purchase details',
    products: createOrderDto.items.map((product) => ({
      name: product.name,
      quantity: product.quantity,
      price: product.price,
    })),
    custom_fields: [
      {
        display_name: "Product",
        variable_name: "product_name",
        value: createOrderDto.items.map((product) => product.name).join(", "),
      },
      {
        display_name: "Total Quantity",
        variable_name: "total_quantity",
        value: createOrderDto.items.reduce((sum, product) => sum + product.quantity, 0),
      },
    ],
  };

  // Build the parameters for the Paystack request
  const params = JSON.stringify({
    email: email, // The payer's email
    amount: this.convertAmount(amount, currency), // Convert amount to the smallest unit
    currency: currency.toUpperCase(), // Ensure currency is uppercase (e.g., USD, GHS)
    callback_url: callback_url, // Correctly include the callback URL here
    metadata: metadata, // Attach metadata, including custom fields
  });

  const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: '/transaction/initialize',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = JSON.parse(data);
        if (res.statusCode === 200) {
          resolve(response.data); // Ensure that the response contains the authorization_url
        } else {
          reject(new HttpException(response, res.statusCode));
        }
      });
    });

    req.on('error', (error) => {
      reject(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
    });

    req.write(params);
    req.end();
  });
}

// async initializePayment(
//   email: string,
//   amount: number,
//   currency: string,
//   callback_url: string,
//   createOrderDto: CreateOrderDto,
// ): Promise<any> {
//   // Build the metadata with custom fields
//   const metadata = {
//     message: 'Purchase details',
//     products: createOrderDto.items.map((product) => ({
//       name: product.name,
//       quantity: product.quantity,
//       price: product.price,
//     })),
//     custom_fields: [
//       {
//         display_name: "Product",
//         variable_name: "product_name",
//         value: createOrderDto.items.map((product) => product.name).join(", "),
//       },
//       {
//         display_name: "Total Quantity",
//         variable_name: "total_quantity",
//         value: createOrderDto.items.reduce((sum, product) => sum + product.quantity, 0),
//       },
//     ],
//   };

//   // Build the parameters for the Paystack request
//   const params = JSON.stringify({
//     email: email,
//     amount: this.convertAmount(amount, currency), // Convert amount to the smallest unit
//     currency: currency.toUpperCase(), // Ensure currency is uppercase (e.g., USD, GHS)
//     callback_url: callback_url, // Correctly include the callback URL here
//     metadata: metadata, // Attach metadata, including custom fields
//   });

//   const options = {
//     hostname: 'api.paystack.co',
//     port: 443,
//     path: '/transaction/initialize',
//     method: 'POST',
//     headers: {
//       Authorization: `Bearer ${this.secretKey}`,
//       'Content-Type': 'application/json',
//     },
//   };

//   return new Promise((resolve, reject) => {
//     const req = https.request(options, (res) => {
//       let data = '';

//       res.on('data', (chunk) => {
//         data += chunk;
//       });

//       res.on('end', () => {
//         const response = JSON.parse(data);
//         if (res.statusCode === 200) {
//           resolve(response.data); // Ensure that the response contains the authorization_url
//         } else {
//           reject(new HttpException(response, res.statusCode));
//         }
//       });
//     });

//     req.on('error', (error) => {
//       reject(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
//     });

//     req.write(params);
//     req.end();
//   });
// }

  // Verify payment (Optional)
  async verifyPayment(reference: string): Promise<any> {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path: `/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          const response = JSON.parse(data);
          console.log('Paystack verification response:', response); // Log the response
          if (res.statusCode === 200) {
            resolve(response);
          } else {
            reject(new HttpException(response, res.statusCode));
          }
        });
        
      });

      req.on('error', (error) => {
        reject(new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR));
      });

      req.end();
    });
  }
}
