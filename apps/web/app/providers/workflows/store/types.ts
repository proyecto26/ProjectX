import { Reducer, Dispatch } from 'react';

import { Workflow, WorkflowType } from '../types';

export enum StoreActions {
  RunWorkflow,
  ClearWorkflow,
  UpdateWorkflow,
  UpsertWorkflow,
}

export type StoreState = {
  isWalletDialogOpen: boolean;
  isWalletInProgress: boolean;
  workflows: Record<WorkflowType, Array<Workflow<unknown>>>;
  accessToken?: string;
  checkoutNftAddress: string | undefined;
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
