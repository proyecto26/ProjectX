import { canUseDOM } from '@projectx/ui';

import { authAPIUrl, environment, orderAPIUrl } from '~/config/app.config.server';

export const NODE_ENV = canUseDOM ? window?.ENV?.NODE_ENV : environment;
export const AUTH_API_URL = canUseDOM ? window?.ENV?.AUTH_API_URL : authAPIUrl;
export const ORDER_API_URL = canUseDOM
  ? window?.ENV?.ORDER_API_URL
  : orderAPIUrl;
