import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number(process.env.AUTH_PORT) || 9095,
  environment: process.env.NODE_ENV,
  apiPrefix: 'auth',
  allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') ?? [],
  logLevel: process.env.LOG_LEVEL ?? 'info',
  jwtSecret: process.env.JWT_SECRET,
}));
