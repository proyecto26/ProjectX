import { condition, proxyActivities, setHandler, log, isCancellation, CancellationScope } from '@temporalio/workflow';

// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  getLoginStateQuery,
  LoginWorkflowCodeStatus,
  LoginWorkflowData,
  LoginWorkflowNonRetryableErrors,
  LoginWorkflowState,
  LoginWorkflowStatus,
  verifyLoginCodeUpdate,
} from '../../../../libs/backend/core/src/lib/user/user.workflow';
import type { ActivitiesService } from '../app/activities/activities.service';

const { sendLoginEmail } = proxyActivities<ActivitiesService>({
  startToCloseTimeout: '5m',
  retry: {
    initialInterval: '2s',
    maximumInterval: '10s',
    maximumAttempts: 10,
    backoffCoefficient: 2,
    nonRetryableErrorTypes: [
      LoginWorkflowNonRetryableErrors.UNKNOWN_ERROR
    ],
  },
});

const { verifyLoginCode } = proxyActivities<ActivitiesService>({
  startToCloseTimeout: '5m',
  retry: {
    initialInterval: '2s',
    maximumInterval: '10s',
    maximumAttempts: 10,
    nonRetryableErrorTypes: [
      LoginWorkflowNonRetryableErrors.UNKNOWN_ERROR
    ],
    backoffCoefficient: 2,
  },
});

export async function loginUserWorkflow(data: LoginWorkflowData): Promise<void> {

  const state: LoginWorkflowState = {
    codeStatus: LoginWorkflowCodeStatus.PENDING,
    status: LoginWorkflowStatus.PENDING,
  };
  // Attach queries, signals and updates
  setHandler(getLoginStateQuery, () => state);
  setHandler(
    verifyLoginCodeUpdate,
    async (code) => {
      const user = await verifyLoginCode(data.email, code, state.code);
      return { user };
    },
    { description: 'Validate login code' },
  );

  try {
    // Send login email with a generated hashed code
    const hashedCode = await sendLoginEmail(data.email);
    state.code = hashedCode;
    state.codeStatus = LoginWorkflowCodeStatus.SENT;

    // Wait for user to verify code (human interaction)
    if (await condition(() => !!state.user, '10m')) {
      state.status = LoginWorkflowStatus.SUCCESS;
      log.info(`User logged in, user: ${state.user}`);
    } else {
      state.status = LoginWorkflowStatus.FAILED;
      log.error(`User login failed, email: ${data.email}`);
    }
  } catch (error) {
    log.error(`Login workflow failed, email: ${data.email}, error: ${error}`);

    if (isCancellation(error)) {
      return await CancellationScope.nonCancellable(async () => {
        // TODO: Handle cancellation
      });
    }
  }
}
