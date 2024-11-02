import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number(process.env.ORDER_PORT) || 9096,
  environment: process.env.NODE_ENV,
  apiPrefix: 'order',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') ?? [],
  logLevel: process.env.LOG_LEVEL ?? 'info',
}));
