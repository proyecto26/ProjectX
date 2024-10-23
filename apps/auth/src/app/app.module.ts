import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validateConfiguration } from '@projectx/utils';

import appConfig from '../config/app.config';
import { EnvironmentVariables } from '../config/env.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
      ],
      validate: (config) => validateConfiguration(config, EnvironmentVariables),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
