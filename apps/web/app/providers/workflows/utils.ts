import { useMemo } from 'react';

import { StoreState } from './store';
import { Workflow, WorkflowType } from './types';

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
