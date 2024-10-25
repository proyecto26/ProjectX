export enum WorkflowTypes {
  ORDER = 'order',
}

export type WorkflowType = WorkflowTypes | `${WorkflowTypes}`;
export enum WorkflowStep {
  START = 'start',
  STATUS = 'status',
  CANCEL = 'cancel',
}

export interface Workflow<T> {
  email?: string;
  referenceId: string;
  step: WorkflowStep | `${WorkflowStep}`;
  data: T;
  error?: Error;
  isCanceling?: boolean;
  retries?: number;
  maxRetries?: number;
  expirationTimeInMilliseconds?: number;
  isInitialized?: boolean;
  startDate?: number;
}
