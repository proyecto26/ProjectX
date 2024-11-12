import { CreateOrderDto } from '@projectx/models';
import { defineQuery, defineSignal } from '@temporalio/workflow';

export type OrderWorkflowData = {
  email: string;
  order: CreateOrderDto;
};

export const getWorkflowIdByPaymentOrder = (orderId: number) => {
  return `payment-${orderId}`;
};

export enum OrderWorkflowStatus {
  PENDING = 'Pending',
  PROCESSING_PAYMENT = 'ProcessingPayment',
  PAYMENT_COMPLETED = 'PaymentCompleted',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}
export type OrderWorkflowState = {
  status: OrderWorkflowStatus;
  orderId?: number;
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

export const PROCESS_PAYMENT_TIMEOUT = '20 minutes';

// DEFINE QUERIES
export const getOrderStateQuery =
  defineQuery<OrderWorkflowState>('getOrderStateQuery');

/**
 * Represents a payment webhook event received from third-party payment providers
 * such as Stripe, MercadoPago, PayU, Wompi, etc.
 *
 * @property {string} id - Unique identifier for the webhook event.
 * @property {string} type - Type of the event (e.g., 'payment_intent.succeeded').
 * @property {string} provider - Payment provider sending the webhook (e.g., 'Stripe', 'PayU').
 * @property {Object} data - Payload containing event-specific data.
 */
export type PaymentWebhookEvent = {
  id?: string;
  type: string;
  provider: 'Stripe' | 'MercadoPago' | 'PayU' | 'Wompi';
  data: Record<string, unknown>;
};

// DEFINE SIGNALS
/**
 * Receive a payment webhook event, webhook events is particularly useful for listening to asynchronous events
 * such as when a customer’s bank confirms a payment, a customer disputes a charge,
 * a recurring payment succeeds, or when collecting subscription payments.
 */
export const paymentWebHookEventSignal = defineSignal<[PaymentWebhookEvent]>(
  'paymentWebHookSignal'
);
