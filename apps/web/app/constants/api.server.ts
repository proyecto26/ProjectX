import { canUseDOM } from '@projectx/ui';

import { authAPIUrl, orderAPIUrl } from '~/config/app.config';

export const AUTH_API_URL = canUseDOM ? window?.ENV?.AUTH_API_URL : authAPIUrl;
export const ORDER_API_URL = canUseDOM
  ? window?.ENV?.ORDER_API_URL
  : orderAPIUrl;
