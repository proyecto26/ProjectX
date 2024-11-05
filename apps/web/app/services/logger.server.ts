import { createLoggerOptions } from '@projectx/core/logger';
import pino from 'pino';

import { NODE_ENV } from '~/constants';

const loggerOptions = createLoggerOptions('info', 'web', NODE_ENV);
export const logger = pino(loggerOptions);
