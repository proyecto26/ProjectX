import { LoaderFunction } from '@remix-run/node';

import { logoutRedirect } from '~/cookies/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  throw await logoutRedirect(request);
};
