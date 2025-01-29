import { useMemo } from 'react';
import { Workflow, WorkflowType } from './types';
import { useStoreState } from './store';

/**
 * Find a workflow by its type and predicate
 * It's used to determine if there is a existing workflow for a specific task
 */
export const useCurrentWorkflow = <T extends Workflow<unknown>>(
  workflowType: WorkflowType,
  predicate: (value: T, index: number, obj: T[]) => unknown,
) => {
  const store = useStoreState();
  const workflows = store?.workflows[workflowType] as T[];
  const currentWorkflow = useMemo(() => {
    const workflow = (workflows || []).find(predicate);
    return workflow;
    // eslint-disable-next-line
  }, [workflowType, workflows]);

  return currentWorkflow;
};
