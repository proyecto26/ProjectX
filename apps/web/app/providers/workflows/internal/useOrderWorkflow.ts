import { useLocation } from '@remix-run/react';
import { UseQueryOptions, useQueries } from '@tanstack/react-query';
import _ from 'lodash';
import { toast } from 'react-toastify';

import { EXPIRED_STATUS_CODE } from '../constants';
import { cancelOrder, getOrderStatus, startOrder } from '../services/order';
import { useWorkflowActions } from '../useWorkflowActions';
import { useWorkflowExpiration } from './useWorkflowExpiration';
import {
  OrderFailureStatus,
  OrderStatus,
  OrderStatusResponse,
  OrderSuccessStatus,
  OrderWorkflow,
  WorkflowStep,
  WorkflowTypes,
} from '../types';

export type WorkflowProps = {
  accessToken?: string;
  workflows: Array<OrderWorkflow>;
};

const VALID_HTTP_STATUS_ERRORS = ['404', '409', '422', '503'];
const END_STATUS = [...OrderSuccessStatus, ...OrderFailureStatus];
const QUERY_KEY = 'checkout-workflow';
const WORKFLOW_TYPE = WorkflowTypes.ORDER;

export const useOrderWorkflow = ({ accessToken, workflows }: WorkflowProps) => {
  const location = useLocation();
  const {
    handleError,
    handleClear,
    handleUpsert,
    handleUpdate,
    handleInitilize,
  } = useWorkflowActions<OrderWorkflow>({
    workflowType: WORKFLOW_TYPE,
  });
  const { handleExpiration } = useWorkflowExpiration({
    workflowType: WORKFLOW_TYPE,
  });

  const handleRequestError = (workflow: OrderWorkflow, error: Error) => {
    if (!VALID_HTTP_STATUS_ERRORS.includes(error.message)) {
      handleError({ workflow, error });
      return null;
    }
    throw error;
  };

  return useQueries({
    queries: workflows
      .filter((w) => !w.error)
      .map((workflow) => {
        return {
          cacheTime: 0,
          refetchIntervalInBackground: true,
          refetchOnWindowFocus: true,
          queryKey: [
            QUERY_KEY,
            workflow.step,
            workflow.data?.productId,
            workflow.isInitialized,
          ],
          queryFn: async () => {
            switch (workflow.step) {
              case WorkflowStep.STATUS:
                try {
                  const orderState: OrderStatusResponse = await getOrderStatus(
                    workflow.referenceId,
                    accessToken
                  );
                  if (END_STATUS.includes(orderState.status)) {
                    return orderState;
                  }
                  if (!workflow.isInitialized) {
                    handleInitilize(workflow.referenceId);
                    return null;
                  }
                  return Promise.reject('Order status is loading');
                } catch (error) {
                  if (error.message === EXPIRED_STATUS_CODE) {
                    handleClear({ workflow });
                  }
                  throw error;
                } finally {
                  handleExpiration(workflow);
                }
              case WorkflowStep.CANCEL:
                try {
                  await cancelOrder(workflow.referenceId, accessToken);
                  return true;
                } catch {
                  return false;
                }
              case WorkflowStep.START:
              default:
                try {
                  const referenceId = await startOrder(
                    workflow.data.productId,
                    workflow.referenceId,
                    accessToken
                  );
                  return referenceId;
                } catch (error) {
                  return handleRequestError(workflow, error as Error);
                }
            }
          },
          enabled: !!accessToken,
          retry: true,
          useErrorBoundary: () => false,
          onSuccess: async (response: OrderStatusResponse | string) => {
            // Choose the next step of the workflow
            const checkoutResponse = response as OrderStatusResponse;
            const isOrderPage = location.pathname.includes('/checkout');
            switch (workflow.step) {
              case WorkflowStep.STATUS:
                if (!checkoutResponse) {
                  return;
                }
                handleUpsert({
                  referenceId: workflow.referenceId,
                  workflow: {
                    data: {
                      ...workflow.data,
                      response: checkoutResponse,
                    },
                  },
                });
                if (OrderSuccessStatus.includes(checkoutResponse?.status)) {
                  toast.success('Order completed successfully');
                } else if (
                  !isOrderPage &&
                  OrderFailureStatus.includes(checkoutResponse?.status)
                ) {
                  toast.error(
                    checkoutResponse.orderStatus === OrderStatus.CANCELLED
                      ? 'The transaction was cancelled.'
                      : 'The transaction has failed, please try again.'
                  );
                }
                break;
              case WorkflowStep.CANCEL:
                handleUpsert({
                  referenceId: workflow.referenceId,
                  workflow: {
                    step: WorkflowStep.STATUS,
                    retries: 0,
                  },
                });
                break;
              case WorkflowStep.START:
              default:
                if (_.isString(response)) {
                  handleUpdate({
                    workflow: {
                      ...workflow,
                      step: WorkflowStep.STATUS,
                      // New referenceId
                      referenceId: response,
                      retries: 0,
                    },
                    // Current referenceId
                    referenceId: workflow.referenceId,
                  });
                }
                break;
            }
          },
        } as UseQueryOptions;
      }),
  });
};
