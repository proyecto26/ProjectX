import { ConfigService } from '@nestjs/config';
import {
  bundleWorkflowCode,
  NativeConnection,
  WorkerOptions,
} from '@temporalio/worker';

export async function createWorkerOptions(
  config: ConfigService,
  workflowsPath: string
): Promise<WorkerOptions> {
  const temporalHost = config.get('temporal.host');
  const temporalNamespace = config.get('temporal.namespace');
  const temporalTaskQueue = config.get('temporal.taskQueue');
  const connection = await NativeConnection.connect({
    address: temporalHost,
    // tls configuration
  });
  
  const workflowBundle = await bundleWorkflowCode({
    workflowsPath,
  });

  return {
    connection,
    namespace: temporalNamespace,
    taskQueue: temporalTaskQueue,
    workflowBundle,
  };
}
