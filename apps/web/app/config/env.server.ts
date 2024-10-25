import { authAPIUrl, orderAPIUrl } from './app.config';

export function getEnv() {
  return {
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
