import { CreateOrderDto } from '@projectx/models';
import { defineQuery, defineSignal, defineUpdate } from '@temporalio/workflow';

import { AuthUser } from '../user';
import { PaymentProvider } from './providers';

export type OrderWorkflowData = {
  user: AuthUser;
  order: CreateOrderDto;
};

export const getWorkflowIdByPaymentOrder = (referenceId: string) => {
  return `payment-${referenceId}`;
};

export enum OrderWorkflowStatus {
  PENDING = 'Pending',
  INITIALIZED = 'Initialized',
  PROCESSING_PAYMENT = 'ProcessingPayment',
  PAYMENT_COMPLETED = 'PaymentCompleted',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export type OrderWorkflowState = {
  status: OrderWorkflowStatus;
  orderId?: number;
  referenceId: string;
  clientSecret?: string;
};

export enum OrderProcessPaymentStatus {
  PENDING = 'Pending',
  INITIATED = 'Initiated',
  SUCCESS = 'Success',
  DECLINED = 'Declined',
  CANCELLED = 'Cancelled',
  FAILURE = 'Failure',
}

export type OrderProcessPaymentState = {
  status: OrderProcessPaymentStatus;
};

export enum OrderWorkflowNonRetryableErrors {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR_NON_RETRY',
}

/**
 * Represents a payment webhook event received from third-party payment providers
 * such as Stripe, MercadoPago, PayU, Wompi, etc.
 */
export type PaymentWebhookEvent = {
  id: string;
  type: string;
  provider: PaymentProvider | `${PaymentProvider}`;
  data: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    metadata: {
      userId: number;
      referenceId: string;
    };
  };
};

export const PROCESS_PAYMENT_TIMEOUT = '20 minutes';

// DEFINE QUERIES
export const getOrderStateQuery = defineQuery<OrderWorkflowState>('getOrderState');

// DEFINE SIGNALS
/**
 * Receive a payment webhook event, webhook events is particularly useful for listening to asynchronous events
 * such as when a customer's bank confirms a payment, a customer disputes a charge,
 * a recurring payment succeeds, or when collecting subscription payments.
 */
export const paymentWebHookEventSignal = defineSignal<[PaymentWebhookEvent]>('paymentWebhookEvent');

// DEFINE UPDATES
export const createOrderUpdate = defineUpdate<
  OrderWorkflowState
>('createOrderUpdate');
