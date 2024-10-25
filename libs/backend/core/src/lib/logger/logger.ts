import { Environment } from '@projectx/models';
import { LoggerOptions } from 'pino';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

export function createLoggerOptions(
  level: string,
  serviceName: string,
  environment: Environment
) {
  const isProduction = environment === Environment.Production;

  return <LoggerOptions>{
    level,
    name: serviceName,
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    base: { service: serviceName },
    transport: !isProduction
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
    // Generate a correlation ID for each request
    genReqId: (request: Request) =>
      request.headers['x-correlation-id'] || uuidv4(),
  };
}
