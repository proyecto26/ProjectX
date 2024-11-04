import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('app.jwtSecret'),
        signOptions: { expiresIn: '12 days', algorithm: 'RS256' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class CoreModule {}
