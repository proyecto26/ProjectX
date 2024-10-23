import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Environment } from '@projectx/models';
import { json, urlencoded } from 'body-parser';

import { setupAppSecurity } from '../security';
import { setupAppSwagger } from '../swagger';

const TRUSTED_IPS = ['127.0.0.1'];

type NestFactoryCreate = [module: object, options?: NestApplicationOptions];

export async function bootstrapApp<T extends NestExpressApplication>(
  ...params: NestFactoryCreate
) {
  // Initialize app
  const app = await NestFactory.create<T>(...params);

  const configService = app.get(ConfigService);
  const env = configService.get('app.environment');
  const port = configService.get('app.port');
  const apiPrefix = configService.get('app.apiPrefix');

  app.setGlobalPrefix(apiPrefix);

  const logger = new Logger('BootstrapWorker');
  logger.log(`Starting worker on port ${port}`);

  // PARSE HTTP REQUESTS
  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: '10mb' }));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // SECURITY
  setupAppSecurity(app);

  // Local development
  if (env === Environment.Development) {
    app.enableShutdownHooks();
    app.useLogger(['error', 'warn', 'debug', 'verbose']);
  }

  // Register the proxy's IP address (load balancer or reverse proxy)
  app.set('trust proxy', function (ip: string) {
    return TRUSTED_IPS.includes(ip);
  });

  // Enable Swagger UI
  if (env !== Environment.Production) {
    setupAppSwagger(app);
  }

  await app.listen(port);
  logger.log(`🚀 Application is running on port ${port}`);
}
