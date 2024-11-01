import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CoreModule, validateConfiguration } from '@projectx/core';
import { DbModule } from '@projectx/db';
import { EmailModule } from '@projectx/email';

import { EnvironmentVariables } from '../config/env.config';
import appConfig from '../config/app.config';
import swaggerConfig from '../config/swagger.config';
import temporalConfig from '../config/temporal.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { WorkerModule } from './worker/worker.module';

@Module({
  imports: [
    DbModule,
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        swaggerConfig,
        temporalConfig,
      ],
      validate: (config) => validateConfiguration(config, EnvironmentVariables),
    }),
    EmailModule,
    UserModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
