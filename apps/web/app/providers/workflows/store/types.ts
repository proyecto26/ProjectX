import { Reducer, Dispatch } from 'react';

import { Workflow, WorkflowType } from '../types';

export enum StoreActions {
  RunWorkflow,
  ClearWorkflow,
  UpdateWorkflow,
  UpsertWorkflow,
}

export type StoreState = {
  workflows: Record<WorkflowType, Array<Workflow<unknown>>>;
};

export type StoreAction =
  | {
  type: StoreActions.RunWorkflow;
  payload: Workflow<unknown>;
      workflowType: WorkflowType;
}
  | {
  type: StoreActions.ClearWorkflow;
      referenceId: Workflow<unknown>['referenceId'];
  workflowType: WorkflowType;
}
  | {
  type: StoreActions.UpdateWorkflow;
  payload: Workflow<unknown>;
      workflowType: WorkflowType;
      referenceId: Workflow<unknown>['referenceId'];
}
  | {
  type: StoreActions.UpsertWorkflow;
  payload: Partial<Workflow<unknown>>;
      workflowType: WorkflowType;
      referenceId: Workflow<unknown>['referenceId'];
    };

export type StoreReducer = Reducer<StoreState, StoreAction>;
export type StoreDispatch = Dispatch<StoreAction>;

export type ContextProps = [StoreState, StoreDispatch];
