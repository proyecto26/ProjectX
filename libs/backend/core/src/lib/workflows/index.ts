import { defineSignal, defineUpdate } from '@temporalio/workflow';

export * from './state';

export type WorkflowParentData = {
  workflowId: string;
  runId: string;
};

// DEFINE SIGNALS
/**
 * Send a request to cancel the workflow
 */
export const cancelWorkflowSignal = defineSignal('cancelWorkflowSignal');

// DEFINE UPDATES
/**
 * Try to cancel the workflow and return true if successful
 */
export const cancelWorkflowUpdate = defineUpdate<boolean>('cancelWorkflowUpdate');
