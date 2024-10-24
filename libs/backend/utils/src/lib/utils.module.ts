import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment } from '@projectx/models';
import { LoggerModule } from 'nestjs-pino';

import { createLoggerOptions } from './logger';
import { HealthModule } from './health';

@Module({
  imports: [
    HealthModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          pinoHttp: createLoggerOptions(
            config.get('app.logLevel') ?? 'info',
            config.get('app.apiPrefix') ?? 'app',
            config.get('app.environment') ?? Environment.Development
          ),
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class UtilsModule {}
