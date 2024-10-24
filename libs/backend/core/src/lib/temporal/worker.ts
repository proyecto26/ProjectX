import { ConfigService } from '@nestjs/config';
import {
  bundleWorkflowCode,
  DefaultLogger,
  NativeConnection,
  Runtime,
  WorkerOptions,
} from '@temporalio/worker';
import pino from 'pino';
import { join } from 'path';

import { createLoggerOptions } from '../logger';

export async function createWorkerOptions(
  config: ConfigService,
  dirName: string
): Promise<WorkerOptions> {
  const logLevel = config.get('app.logLevel');
  const apiPrefix = config.get('app.apiPrefix');
  const environment = config.get('app.environment');
  const loggerOptions = createLoggerOptions(logLevel, apiPrefix, environment);
  const pinoLogger = pino(loggerOptions);
  // Create loggers with different labels for the separate components
  const workerWinstonLogger = pinoLogger.child({ label: 'worker' });

  Runtime.install({
    logger: new DefaultLogger('DEBUG', (entry) => {
      workerWinstonLogger.debug({
        message: entry.message,
        timestamp: Number(entry.timestampNanos / 1_000_000n),
        ...entry.meta,
      });
    }),
  });
  const temporalHost = config.get('app.temporalHost');
  const temporalNamespace = config.get('app.temporalNamespace');
  const temporalTaskQueue = config.get('app.temporalTaskQueue');
  const connection = await NativeConnection.connect({
    address: temporalHost,
    // tls configuration
  });

  const workflowBundle = await bundleWorkflowCode({
    workflowsPath: join(__dirname, dirName),
  });

  return {
    connection,
    namespace: temporalNamespace,
    taskQueue: temporalTaskQueue,
    workflowBundle,
  };
}
