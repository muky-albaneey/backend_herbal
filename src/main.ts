// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import * as cookieParser from 'cookie-parser';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as dotenv from 'dotenv';
// import * as express from 'express';

// async function bootstrap() {
//   dotenv.config();
//   const app = await NestFactory.create(AppModule);

//   // Middleware to parse raw body for Stripe webhooks
//   app.use('/paystack/webhook', express.raw({ type: 'application/json' }));

//   // Default JSON body parser for other routes
//   app.use(express.json());

//   app.use(cookieParser());

//   // Get the frontend URL from environment variables
//   const frontendUrl =  'https://kenzy-dashboard.onrender.com' || 'https://herbal-beta.vercel.app';

//   app.enableCors({
//     origin: frontendUrl,
//     credentials: true,
//     methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
//   });

//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     forbidNonWhitelisted: true,
//     transform: true,
//   }));

//   const configService = app.get(ConfigService);
//   const PORT = configService.get<number>('PORT') || 3000;
//   await app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Running in ${configService.get<string>('NODE_ENV')} on port ${PORT}`);
//   });
// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as express from 'express';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // Middleware to parse raw body for Stripe webhooks
  app.use('/paystack/webhook', express.raw({ type: 'application/json' }));

  // Default JSON body parser for other routes
  app.use(express.json());

  app.use(cookieParser());

  // Define frontend URLs
  const frontendUrls = [
    'https://kenzy-dashboard.onrender.com',
    'https://herbal-beta.vercel.app',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl requests)
      if (!origin || frontendUrls.includes(origin)) {
        return callback(null, true);
      }
      // Reject requests from unknown origins
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;
  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Running in ${configService.get<string>('NODE_ENV')} on port ${PORT}`);
  });
}
bootstrap();
