import { authAPIUrl, environment, orderAPIUrl } from './app.config.server';

export function getEnv() {
  console.log(authAPIUrl);
  return {
    NODE_ENV: environment,
    AUTH_API_URL: authAPIUrl,
    ORDER_API_URL: orderAPIUrl,
  };
}

export type ENV = ReturnType<typeof getEnv>;

declare global {
  // eslint-disable-next-line no-var
  var ENV: ReturnType<typeof getEnv>;
  interface window {
    ENV: ENV;
  }
}
