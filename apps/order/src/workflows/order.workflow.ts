/* eslint-disable @nx/enforce-module-boundaries */
import {
  allHandlersFinished,
  ChildWorkflowHandle,
  condition,
  setHandler,
  startChild,
} from '@temporalio/workflow';

import {
  OrderProcessPaymentStatus,
  OrderWorkflowData,
  OrderWorkflowState,
  OrderWorkflowStatus,
  getOrderStateQuery,
  getWorkflowIdByPaymentOrder,
} from '../../../../libs/backend/core/src/lib/order/workflow.utils';
import {
  cancelWorkflowSignal,
} from '../../../../libs/backend/core/src/lib/workflows';
import { processPayment } from './process-payment.workflow';

const initialState: OrderWorkflowState = {
  status: OrderWorkflowStatus.PENDING,
  orderId: 0,
};

export async function createOrder(
  data: OrderWorkflowData,
  state = initialState
): Promise<void> {
  let processPaymentWorkflow: ChildWorkflowHandle<typeof processPayment>;
  // Attach queries, signals and updates
  setHandler(getOrderStateQuery, () => state);
  setHandler(
    cancelWorkflowSignal,
    () => processPaymentWorkflow?.signal(cancelWorkflowSignal)
  );
  // TODO: Create the order in the database

  state.status = OrderWorkflowStatus.PROCESSING_PAYMENT;
  processPaymentWorkflow = await startChild(processPayment, {
    args: [data],
    workflowId: getWorkflowIdByPaymentOrder(state.orderId),
  });
  const processPaymentResult = await processPaymentWorkflow.result();
  if (processPaymentResult.status === OrderProcessPaymentStatus.SUCCESS) {
    state.status = OrderWorkflowStatus.PAYMENT_COMPLETED;
  } else {
    state.status = OrderWorkflowStatus.FAILED;
    return;
  }
  processPaymentWorkflow = undefined;
  //...
  state.status = OrderWorkflowStatus.COMPLETED;
  // Wait for all handlers to finish before workflow completion
  await condition(allHandlersFinished);
}
