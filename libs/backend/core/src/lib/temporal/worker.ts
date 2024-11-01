import { ConfigService } from '@nestjs/config';
import {
  bundleWorkflowCode,
  DefaultLogger,
  NativeConnection,
  Runtime,
  WorkerOptions,
} from '@temporalio/worker';
import pino from 'pino';

import { createLoggerOptions } from '../logger';

export async function createWorkerOptions(
  config: ConfigService,
  workflowsPath: string
): Promise<WorkerOptions> {
  const logLevel = config.get('app.logLevel') || 'info';
  const apiPrefix = config.get('app.apiPrefix');
  const environment = config.get('app.environment');
  const loggerOptions = createLoggerOptions(logLevel, apiPrefix, environment);
  const pinoLogger = pino(loggerOptions);
  // Create loggers with different labels for the separate components
  const workerLogger = pinoLogger.child({ label: 'worker' });

  Runtime.install({
    logger: new DefaultLogger(logLevel, (entry) => {
      workerLogger.debug({
        message: entry.message,
        timestamp: entry.timestampNanos,
        ...entry.meta,
      });
    }),
  });
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
