import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
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
  getOrderStateQuery,
  cancelWorkflowSignal,
} from '@projectx/core';
import {
  WorkflowExecutionAlreadyStartedError,
  WorkflowIdConflictPolicy,
} from '@temporalio/common';
import { WithStartWorkflowOperation } from '@temporalio/client';

import { createOrder } from '../workflows/order.workflow';

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
        this.logger.error(`createOrder(${user.email}) - Error creating order`, error);
        throw new BadRequestException(
          'Error creating order',
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

    if (Date.now() - description.startTime.getTime() >= WORKFLOW_TTL) {
      throw new HttpException('Order has expired', HttpStatus.GONE);
    }

    const handle = this.clientService.client?.workflow.getHandle(workflowId);
    const state = await handle.query(getOrderStateQuery);
    return state;
  }

  async cancelOrder(referenceId: string) {
    this.logger.log(`cancelOrder(${referenceId}) - cancelling order`);
    const workflowId = this.getWorkflowIdByReferenceId(referenceId);
    const handle = this.clientService.client?.workflow.getHandle(workflowId);
    await handle.signal(cancelWorkflowSignal);
  }

  async handleWebhook(payload: string | Buffer, signature: string) {
    if (!payload || !signature) {
      this.logger.error(`handleWebhook(${signature}) - No payload received`);
      throw new BadRequestException('No payload received');
    }
    this.logger.log(`handleWebhook(${signature}) - Processing webhook event`);
    try {
      // Verify and construct the webhook event
      const event = this.stripeService.constructWebhookEvent(
        payload,
        signature
      );

      // Extract payment intent data
      const paymentIntent = this.stripeService.handleWebhookEvent(event);
      if (!paymentIntent?.metadata) {
        this.logger.error(`handleWebhook(${signature}) - Unhandled event type: ${event.type}`);
        return { received: true };
      }
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
      this.logger.error(`handleWebhook(${signature}) - Webhook Error: ${err.message}`);
      throw new BadRequestException('Webhook Error', {
        cause: err,
      });
    }
  }
}
