/* eslint-disable no-case-declarations */
import { canUseDOM } from '@projectx/ui';
import { produce } from 'immer';

import { StoreState, StoreActions, StoreAction } from './types';

const LOCAL_STORAGE_KEY = 'workflows-store';

function getInitialState(): StoreState {
  const savedState = canUseDOM ? window.localStorage.getItem(LOCAL_STORAGE_KEY) : null;

  return savedState
    ? JSON.parse(savedState)
    : {
        isWalletDialogOpen: false,
        isWalletInProgress: false,
        workflows: {},
        checkoutNftAddress: undefined,
      };
}

export const initialState = getInitialState();

export const updateLocalStorage = (state: StoreState) =>
  canUseDOM && window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));

export const reducer = (
  state: ReturnType<typeof getInitialState>,
  action: StoreAction,
): StoreState => {
  const nextState = produce(state, (draftState) => {
    switch (action.type) {
      case StoreActions.RunWorkflow:
        draftState.workflows =
          draftState.workflows || getInitialState().workflows;
        draftState.workflows[action.workflowType] =
          draftState.workflows[action.workflowType] || [];
        draftState.workflows[action.workflowType].push(action.payload);
        break;
      case StoreActions.ClearWorkflow:
        draftState.workflows =
          draftState.workflows || getInitialState().workflows;
        const workflowsToClear =
          draftState.workflows[action.workflowType] || [];
        draftState.workflows[action.workflowType] = workflowsToClear.filter(
          ({ referenceId }) => action.referenceId !== referenceId,
        );
        break;
      case StoreActions.UpdateWorkflow:
        draftState.workflows =
          draftState.workflows || getInitialState().workflows;
        const workflowsToUpdate =
          draftState.workflows[action.workflowType] || [];
        // Clear the workflows using the current referenceId
        draftState.workflows[action.workflowType] = workflowsToUpdate.filter(
          ({ referenceId }) => action.referenceId !== referenceId,
        );
        // Add the updated workflow
        draftState.workflows[action.workflowType].push(action.payload);
        break;
      case StoreActions.UpsertWorkflow:
        draftState.workflows =
          draftState.workflows || getInitialState().workflows;
        draftState.workflows[action.workflowType] =
          draftState.workflows[action.workflowType] || [];
        const workflowIndex = draftState.workflows[
          action.workflowType
        ].findIndex(({ referenceId }) => referenceId === action.referenceId);
        if (workflowIndex === -1) {
          draftState.workflows[action.workflowType].push(action.payload);
        } else {
          const prevState =
            draftState.workflows[action.workflowType][workflowIndex];
          draftState.workflows[action.workflowType][workflowIndex] = {
            ...prevState,
            ...action.payload,
          };
        }
        break;
      default:
        break;
    }
  });

  // Update local storage for specific actions only, outside the produce function
  switch (action.type) {
    case StoreActions.RunWorkflow:
    case StoreActions.ClearWorkflow:
    case StoreActions.UpdateWorkflow:
    case StoreActions.UpsertWorkflow:
      updateLocalStorage(nextState);
      break;
    default:
      break;
  }

  return nextState;
};
