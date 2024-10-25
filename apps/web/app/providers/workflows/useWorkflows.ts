import { useMemo } from 'react';

import { useOrderWorkflow } from './internal/useOrderWorkflow';
import { StoreState, useStoreState } from './store';
import { OrderWorkflow, Workflow, WorkflowType, WorkflowTypes } from './types';

export type WorkflowProps = {
  accessToken?: string;
  email?: string;
};

export const useWorkflowsByType = <T extends Workflow<unknown>>(
  store: StoreState,
  workflowType: WorkflowType,
  email?: string,
) => {
  return useMemo(() => {
    return ((store?.workflows[workflowType] as T[]) || []).filter(
      (w) => !w.email || `${w.email}` === `${email}`,
    );
  }, [store?.workflows[workflowType], email]);
};

export const useWorkflows = ({ accessToken, email }: WorkflowProps) => {
  const store = useStoreState();
  useOrderWorkflow({
    accessToken,
    workflows: useWorkflowsByType<OrderWorkflow>(
      store,
      WorkflowTypes.ORDER,
      email,
    ),
  });
};
