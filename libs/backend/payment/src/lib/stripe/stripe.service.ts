import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

import { PaymentConfig } from '../../config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const config = this.configService.get<PaymentConfig>('payment');
    if (!config) {
      throw new InternalServerErrorException('Payment configuration is not loaded');
    }
    const { stripeSecretKey } = config;
    if (!stripeSecretKey) {
      throw new InternalServerErrorException('STRIPE_SECRET_KEY is not configured');
    }
    this.stripe = new Stripe(stripeSecretKey, {
      typescript: true,
    });
  }

  async createPaymentIntent(amount: number, currency = 'usd', metadata: Record<string, string>): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
    });
  }

  async updatePaymentIntent(
    paymentIntentId: string,
    data: Stripe.PaymentIntentUpdateParams
  ): Promise<Stripe.PaymentIntent> {
    return this.stripe.paymentIntents.update(paymentIntentId, data);
  }

  async constructWebhookEvent(payload: string | Buffer, signature: string): Promise<Stripe.Event> {
    const config = this.configService.get<PaymentConfig>('payment');
    if (!config) {
      throw new InternalServerErrorException('Payment configuration is not loaded');
    }
    const { stripeWebhookSecret } = config;
    if (!stripeWebhookSecret) {
      throw new InternalServerErrorException('STRIPE_WEBHOOK_SECRET is not configured');
    }
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeWebhookSecret
    );
  }

  handleWebhookEvent(event: Stripe.Event) {
    let paymentIntent: Stripe.PaymentIntent | undefined;
    
    switch (event.type) {
      case 'payment_intent.succeeded':
        paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle successful payment
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      case 'payment_intent.payment_failed':
        paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle failed payment
        console.log('Payment failed:', paymentIntent.id);
        break;
      // Add more event types as needed
      default:
        console.log('Unhandled event type:', event.type);
    }

    return paymentIntent;
  }
} 