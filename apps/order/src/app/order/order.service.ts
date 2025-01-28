import { Injectable, Logger } from '@nestjs/common';
import { OrderWorkflowData } from '@projectx/core';
import { OrderRepositoryService } from '@projectx/db';
import { StripeService } from '@projectx/payment';

@Injectable()
export class OrderService {
  readonly logger = new Logger(OrderService.name);
  constructor(
    public readonly stripeService: StripeService,
    public readonly orderRepositoryService: OrderRepositoryService
  ) {}

  async createOrder({ user, order }: OrderWorkflowData) {
    this.logger.log(`createOrder(${user.id})`, order);
    // Create order in database with referenceId
    const newOrder = await this.orderRepositoryService.createOrder(user.id, {
      ...order,
      referenceId: order.referenceId,
    });

    // Create payment intent with Stripe
    const paymentIntent = await this.stripeService.createPaymentIntent(
      Math.round(newOrder.totalPrice.toNumber() * 100), // Convert to cents
      'usd',
      {
        userId: user.id.toString(),
        referenceId: order.referenceId,
        orderId: String(newOrder.id),
      }
    );

    return {
      order: newOrder,
      clientSecret: paymentIntent.client_secret,
    };
  }
}
