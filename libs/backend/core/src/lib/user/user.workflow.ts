import type { UserDto } from '@projectx/models';
import { defineQuery, defineUpdate } from '@temporalio/workflow';

export type LoginWorkflowData = {
  email: string;
};

export enum LoginWorkflowCodeStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
}

export enum LoginWorkflowStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export type LoginWorkflowState = {
  codeStatus: LoginWorkflowCodeStatus;
  user?: UserDto;
  status: LoginWorkflowStatus;
  code?: string;
};

export const getLoginStateQuery = defineQuery<LoginWorkflowState | null>(
  'getLoginStateQuery'
);

export type VerifyLoginCodeUpdateResult = {
  user?: UserDto;
};

export const verifyLoginCodeUpdate = defineUpdate<
  VerifyLoginCodeUpdateResult,
  [number]
>('verifyLoginCodeUpdate');

export enum LoginWorkflowRetryableErrors {
  VERIFY_LOGIN_CODE_FAILURE = 'VERIFY_LOGIN_CODE_FAILURE',
}

export enum LoginWorkflowNonRetryableErrors {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR_NON_RETRY',
}