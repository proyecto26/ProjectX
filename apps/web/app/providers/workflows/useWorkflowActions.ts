import { useCallback } from 'react';

import {
  HandleClearEvent,
  HandleErrorEvent,
  HandleRunEvent,
  HandleUpdateEvent,
  HandleUpsertEvent,
  Workflow,
  WorkflowType,
} from './types';
import { StoreActions, useStore } from './store';

type WorkflowActionsProps = {
  workflowType: WorkflowType;
};

export const useWorkflowActions = <T extends Workflow<unknown>>({
  workflowType,
}: WorkflowActionsProps) => {
  const [store, dispatch] = useStore();

  const handleError: HandleErrorEvent<T> = useCallback(
    ({ workflow, error }) => {
      dispatch({
        type: StoreActions.UpdateWorkflow,
        workflowType,
        payload: {
          ...workflow,
          error,
        },
        referenceId: workflow.referenceId,
      });
    },
    [dispatch, workflowType],
  );

  const handleRun: HandleRunEvent<T> = useCallback(
    ({ workflow }) => {
      dispatch({
        type: StoreActions.RunWorkflow,
        workflowType,
        payload: {
          ...workflow,
        },
      });
    },
    [dispatch, workflowType],
  );

  const handleUpdate: HandleUpdateEvent<T> = useCallback(
    ({ workflow, referenceId }) => {
      dispatch({
        type: StoreActions.UpdateWorkflow,
        workflowType,
        payload: {
          ...workflow,
        },
        // Use a new referenceId if provided
        referenceId: referenceId ?? workflow.referenceId,
      });
    },
    [dispatch, workflowType],
  );

  const handleUpsert: HandleUpsertEvent<T> = useCallback(
    ({ workflow, referenceId }) => {
      dispatch({
        type: StoreActions.UpsertWorkflow,
        workflowType,
        payload: {
          ...workflow,
        },
        // Use a new referenceId if provided
        referenceId: referenceId ?? workflow.referenceId,
      });
    },
    [dispatch, workflowType],
  );

  const handleClear: HandleClearEvent<T> = useCallback(
    ({ workflow }) => {
      dispatch({
        type: StoreActions.ClearWorkflow,
        referenceId: workflow?.referenceId,
        workflowType,
      });
    },
    [dispatch, workflowType],
  );

  const handleCancel: HandleUpdateEvent<T> = useCallback(
    ({ workflow }) => {
      handleUpsert({
        workflow: {
          step: 'cancel',
          isCanceling: true,
        } as T,
        referenceId: workflow.referenceId,
      });
    },
    [handleUpsert],
  );

  const handleInitilize = (referenceId: string) => {
    handleUpsert({
      workflow: {
        isInitialized: true,
        startDate: Date.now(),
      } as T,
      referenceId: referenceId,
    });
  };

  return {
    workflows: store.workflows[workflowType] || [],
    handleRun,
    handleError,
    handleClear,
    handleUpdate,
    handleCancel,
    handleUpsert,
    handleInitilize,
  };
};
