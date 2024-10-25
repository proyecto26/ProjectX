import {
  WorkflowClient,
  WorkflowExecutionDescription,
} from '@temporalio/client';
import { temporal } from '@temporalio/proto';

export enum WorkflowSearchAttributes {
  Email = 'Email',
  UserId = 'UserId',
  OrderId = 'OrderId',
}

export const getWorkflowDescription = (
  client: WorkflowClient,
  workflowId: string
) => client.getHandle(workflowId).describe();

export const isWorkflowRunning = (description: WorkflowExecutionDescription) =>
  description.status.code ===
  temporal.api.enums.v1.WorkflowExecutionStatus
    .WORKFLOW_EXECUTION_STATUS_RUNNING;

export const isWorkflowCompleted = (description: WorkflowExecutionDescription) =>
  description.status.code ===
  temporal.api.enums.v1.WorkflowExecutionStatus
    .WORKFLOW_EXECUTION_STATUS_COMPLETED;

export const isWorkflowFailed = (description: WorkflowExecutionDescription) =>
  description.status.code ===
  temporal.api.enums.v1.WorkflowExecutionStatus
    .WORKFLOW_EXECUTION_STATUS_FAILED;

async function getWorkflowExecution(
  client: WorkflowClient,
  identifier: number,
  type: string,
  identifierType: WorkflowSearchAttributes
) {
  const workflow = await client.workflowService.listWorkflowExecutions({
    query: `WorkflowType = "${type}" AND ${identifierType} = ${identifier} AND ExecutionStatus="Running"`,
    namespace: client.options.namespace,
  });
  if (workflow.executions.length > 0) {
    return workflow.executions[0];
  }
  return null;
}

export async function getWorkflowExecutionByEmail(
  client: WorkflowClient,
  email: number,
  type: string
) {
  return getWorkflowExecution(
    client,
    email,
    type,
    WorkflowSearchAttributes.Email
  );
}

export async function getWorkflowExecutionByUserId(
  client: WorkflowClient,
  userId: number,
  type: string
) {
  return getWorkflowExecution(
    client,
    userId,
    type,
    WorkflowSearchAttributes.UserId
  );
}
