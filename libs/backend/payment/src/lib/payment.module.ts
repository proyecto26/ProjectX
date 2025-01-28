import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { StripeService } from './stripe/stripe.service';
import { paymentConfig } from '../config';

@Module({
  imports: [
    ConfigModule.forFeature(paymentConfig)
  ],
  providers: [StripeService],
  exports: [StripeService],
})
export class PaymentModule {}
