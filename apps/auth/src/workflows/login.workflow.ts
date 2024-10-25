import { condition, proxyActivities, setHandler, log } from '@temporalio/workflow';

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

  // Send login email
  const hashedCode = await sendLoginEmail(data.email);
  state.code = hashedCode;
  state.codeStatus = LoginWorkflowCodeStatus.SENT;

  if (await condition(() => !!state.user, '10m')) {
    state.status = LoginWorkflowStatus.SUCCESS;
    log.info(`User logged in, user: ${state.user}`);
  } else {
    state.status = LoginWorkflowStatus.FAILED;
    log.error(`User login failed, email: ${data.email}`);
  }
}
