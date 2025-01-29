import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateOrderDto } from '@projectx/models';
import {
  ClientService,
  getWorkflowDescription,
  isWorkflowRunning,
  WORKFLOW_TTL,
} from '@projectx/workflows';
import { StripeService } from '@projectx/payment';
import {
  OrderWorkflowData,
  paymentWebHookEventSignal,
  PaymentWebhookEvent,
  AuthUser,
  createOrderUpdate,
} from '@projectx/core';
import {
  WorkflowExecutionAlreadyStartedError,
  WorkflowIdConflictPolicy,
} from '@temporalio/common';

import { createOrder } from '../workflows/order.workflow';
import { WithStartWorkflowOperation } from '@temporalio/client';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly clientService: ClientService,
    private readonly stripeService: StripeService
  ) {}

  getWorkflowIdByReferenceId(referenceId: string) {
    return `order-${referenceId}`;
  }

  async createOrder(user: AuthUser, orderDto: CreateOrderDto) {
    this.logger.log(`createOrder(${user.email}) - creating order`);
    const taskQueue = this.configService.get<string>('temporal.taskQueue');
    try {
      // Start workflow with order data
      const workflowData: OrderWorkflowData = {
        user,
        order: orderDto,
      };

      const startWorkflowOperation = new WithStartWorkflowOperation(
        createOrder,
        {
          workflowId: this.getWorkflowIdByReferenceId(orderDto.referenceId),
          args: [workflowData],
          taskQueue,
          workflowIdConflictPolicy: WorkflowIdConflictPolicy.FAIL,
          searchAttributes: {
            UserId: [user.id],
            Email: [user.email],
          },
        }
      );

      const state =
        await this.clientService.client?.workflow.executeUpdateWithStart(
          createOrderUpdate,
          {
            startWorkflowOperation,
          }
        );

      return {
        orderId: state.orderId,
        referenceId: state.referenceId,
        clientSecret: state.clientSecret,
        message: 'Order created successfully',
      };
    } catch (error) {
      if (error instanceof WorkflowExecutionAlreadyStartedError) {
        this.logger.warn(
          `createOrder(${user.email}) - workflow already started`
        );
        throw new HttpException(
          'Order already in progress',
          HttpStatus.CONFLICT
        );
      } else {
        throw new HttpException(
          'Error creating order',
          HttpStatus.INTERNAL_SERVER_ERROR,
          {
            cause: error,
          }
        );
      }
    }
  }

  async getOrderStatus(referenceId: string) {
    this.logger.log(`getOrderStatus(${referenceId}) - getting status`);
    const workflowId = this.getWorkflowIdByReferenceId(referenceId);

    const description = await getWorkflowDescription(
      this.clientService.client?.workflow,
      workflowId
    );

    if (!isWorkflowRunning(description)) {
      throw new HttpException('No active order found', HttpStatus.NOT_FOUND);
    }

    if (Date.now() - description.startTime.getMilliseconds() >= WORKFLOW_TTL) {
      throw new HttpException('Order has expired', HttpStatus.GONE);
    }

    const handle = this.clientService.client?.workflow.getHandle(workflowId);
    const state = await handle.query('getOrderState');
    return state;
  }

  async handleWebhook(payload: Buffer, signature: string) {
    this.logger.log('Processing webhook event');
    try {
      // Verify and construct the webhook event
      const event = await this.stripeService.constructWebhookEvent(
        payload,
        signature
      );

      // Extract payment intent data
      const paymentIntent = this.stripeService.handleWebhookEvent(event);
      const { userId, referenceId } = paymentIntent.metadata;

      if (!userId || !referenceId) {
        this.logger.error(
          'Missing userId or referenceId in payment intent metadata'
        );
        return { received: true };
      }

      // Get workflow handle
      const workflowId = this.getWorkflowIdByReferenceId(referenceId);
      const handle = this.clientService.client?.workflow.getHandle(workflowId);

      // Convert Stripe event to PaymentWebhookEvent
      const webhookEvent: PaymentWebhookEvent = {
        id: event.id,
        type: event.type,
        provider: 'Stripe',
        data: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          metadata: {
            userId: Number(userId),
            referenceId: referenceId,
          },
        },
      };

      // Signal the workflow
      await handle.signal(paymentWebHookEventSignal, webhookEvent);

      // Return true to indicate the webhook was received
      return { received: true };
    } catch (err) {
      this.logger.error('Webhook Error:', err.message);
      throw err;
    }
  }
}
