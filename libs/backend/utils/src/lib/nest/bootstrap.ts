import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'body-parser';

import { setupAppSecurity } from '../security';
import { setupAppSwagger } from '../swagger';
import { Environment } from '../constants';

const TRUSTED_IPS = ['127.0.0.1'];

export async function bootstrapApp(
  ...params: Parameters<typeof NestFactory.create<NestExpressApplication>>
){
  // Initialize app
  const app = await NestFactory.create<NestExpressApplication>(...params);

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
    }),
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
}