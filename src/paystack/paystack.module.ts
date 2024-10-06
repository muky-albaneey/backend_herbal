import { Module } from '@nestjs/common';
import { PaystackService } from './paystack.service';
import { PaystackController } from './paystack.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
  providers: [PaystackService, MailService],
  controllers: [PaystackController],
 
})
export class PaystackModule {}
