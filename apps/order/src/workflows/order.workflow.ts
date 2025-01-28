/* eslint-disable @nx/enforce-module-boundaries */
import {
  allHandlersFinished,
  ChildWorkflowHandle,
  condition,
  proxyActivities,
  setHandler,
  startChild,
} from '@temporalio/workflow';

import {
  OrderProcessPaymentStatus,
  OrderWorkflowData,
  OrderWorkflowNonRetryableErrors,
  OrderWorkflowState,
  OrderWorkflowStatus,
  createOrderUpdate,
  getOrderStateQuery,
  getWorkflowIdByPaymentOrder,
} from '../../../../libs/backend/core/src/lib/order/workflow.utils';
import {
  cancelWorkflowSignal,
} from '../../../../libs/backend/core/src/lib/workflows';
import type { ActivitiesService } from '../main';

const { createOrder: createOrderActivity } = proxyActivities<ActivitiesService>({
  startToCloseTimeout: '5 seconds',
  retry: {
    initialInterval: '2s',
    maximumInterval: '10s',
    maximumAttempts: 10,
    backoffCoefficient: 1.5,
    nonRetryableErrorTypes: [OrderWorkflowNonRetryableErrors.UNKNOWN_ERROR],
  },
});
import { processPayment } from './process-payment.workflow';

const initialState: OrderWorkflowState = {
  status: OrderWorkflowStatus.PENDING,
  orderId: undefined,
  referenceId: '',
  clientSecret: undefined,
};

export async function createOrder(
  data: OrderWorkflowData,
  state = initialState
): Promise<void> {
  // Define references to child workflows
  let processPaymentWorkflow: ChildWorkflowHandle<typeof processPayment>;

  // Attach queries, signals and updates
  setHandler(getOrderStateQuery, () => state);
  setHandler(
    cancelWorkflowSignal,
    () => processPaymentWorkflow?.signal(cancelWorkflowSignal)
  );
  setHandler(createOrderUpdate, async () => {
    const { order, clientSecret } = await createOrderActivity(data);
    state.orderId = order.id;
    state.referenceId = order.referenceId;
    state.clientSecret = clientSecret;
    return state;
  });

  // Wait to create the order in the database
  await condition(() => !!state?.orderId);
  
  // First step: Process payment
  if (state.status === OrderWorkflowStatus.PENDING) {
    processPaymentWorkflow = await startChild(processPayment, {
      args: [data],
      workflowId: getWorkflowIdByPaymentOrder(state.referenceId),
    });
    const processPaymentResult = await processPaymentWorkflow.result();
    if (processPaymentResult.status === OrderProcessPaymentStatus.SUCCESS) {
      state.status = OrderWorkflowStatus.PAYMENT_COMPLETED;
    } else {
      state.status = OrderWorkflowStatus.FAILED;
      return;
    }
    processPaymentWorkflow = undefined;
    state.status = OrderWorkflowStatus.COMPLETED;
  }
  // Wait for all handlers to finish before workflow completion
  await condition(allHandlersFinished);
}
