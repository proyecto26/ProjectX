import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Environment } from '@projectx/models';
import { LoggerModule } from 'nestjs-pino';

import { createLoggerOptions } from './logger';
import { HealthModule } from './health';
import { AuthModule } from './auth';

@Module({
  imports: [
    HealthModule,
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          pinoHttp: createLoggerOptions(
            configService.get('app.logLevel') ?? 'info',
            configService.get('app.apiPrefix') ?? 'app',
            configService.get('app.environment') ?? Environment.Development
          ),
        };
      },
    }),
    AuthModule,
  ],
  exports: [AuthModule],
})
export class CoreModule {}
