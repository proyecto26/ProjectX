import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

import { PaymentConfig } from '../../config';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
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
    try {
      return await this.stripe.paymentIntents.create({
        amount,
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });
    } catch (error) {
      this.logger.error(`Error creating payment intent: ${error}`);
      throw new InternalServerErrorException('Error creating payment intent', {
        cause: error,
      });
    }
  }

  async updatePaymentIntent(
    paymentIntentId: string,
    data: Stripe.PaymentIntentUpdateParams
  ): Promise<Stripe.PaymentIntent> {
    try {
      return await this.stripe.paymentIntents.update(paymentIntentId, data);
    } catch (error) {
      this.logger.error(`Error updating payment intent: ${error}`);
      throw new InternalServerErrorException('Error updating payment intent', {
        cause: error,
      });
    }
  }

  constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
    const config = this.configService.get<PaymentConfig>('payment');
    if (!config) {
      throw new InternalServerErrorException('Payment configuration is not loaded');
    }
    const { stripeWebhookSecret } = config;
    if (!stripeWebhookSecret) {
      throw new InternalServerErrorException('STRIPE_WEBHOOK_SECRET is not configured');
    }
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        stripeWebhookSecret
      );
      return event;
    } catch (error) {
      this.logger.error(`Error constructing webhook event: ${error}`);
      throw new InternalServerErrorException('Error constructing webhook event', {
        cause: error,
      });
    }
  }

  handleWebhookEvent(event: Stripe.Event) {
    let paymentIntent: Stripe.PaymentIntent | undefined;
    
    switch (event.type) {
      case 'payment_intent.created':
        paymentIntent = event.data.object as Stripe.PaymentIntent;
        this.logger.log(`handleWebhookEvent(${paymentIntent.id}) - Payment intent created:`);
        break;
      case 'payment_intent.succeeded':
        paymentIntent = event.data.object as Stripe.PaymentIntent;
        this.logger.log(`handleWebhookEvent(${paymentIntent.id}) - Payment succeeded:`);
        break;
      case 'payment_intent.payment_failed':
        paymentIntent = event.data.object as Stripe.PaymentIntent;
        this.logger.log(`handleWebhookEvent(${paymentIntent.id}) - Payment failed:`);
        break;
      // Add more event types as needed
      default:
        this.logger.error(`handleWebhookEvent(${paymentIntent?.id}) - Unhandled event type: ${event.type}`);
    }

    return paymentIntent;
  }
} 