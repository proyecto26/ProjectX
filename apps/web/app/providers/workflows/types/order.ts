import { Workflow } from "./workflow";

export enum OrderStatus {
  PENDING = 'Pending',
  FAILED = 'Failed',
  EXPIRED = 'Expired',
  PROCESSED = 'Processed',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  INITIATED = 'Initiated',
  UNKOWN_FAILURE = 'UnkownFailure',
}

export interface OrderStartResponse {
  referenceId: string;
}

export interface OrderStatusResponse {
  referenceId: string;
  status: OrderStatus;
  clientSecret?: string;
  productId?: unknown;
  userId?: unknown;
  userEmail?: string;
  price?: number;
  orderStatus?: OrderStatus;
}

export const OrderSuccessStatus = [
  OrderStatus.COMPLETED,
  OrderStatus.PROCESSED,
];

export const OrderFailureStatus = [
  OrderStatus.FAILED,
  OrderStatus.CANCELLED,
  OrderStatus.UNKOWN_FAILURE,
];


export type OrderWorkflowData = {
  productId: unknown;
  response?: unknown;
};

export type OrderWorkflow = Workflow<OrderWorkflowData>;

