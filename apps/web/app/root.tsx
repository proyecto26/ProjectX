import { UserDto } from '@projectx/models';
import type {
  MetaFunction,
  LinksFunction,
  LoaderFunction,
  LoaderFunctionArgs,
} from '@remix-run/node';
import {
  isRouteErrorResponse,
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import { PropsWithChildren } from 'react';
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react';
import { cssBundleHref } from '@remix-run/css-bundle';

import { getEnv } from '~/config/env.server';
import { csrf } from '~/cookies/session.server';
import twStyles from '~/tailwind.css';
import {
  withQueryClientProvider,
  withCartProvider,
  withAuthProvider,
  withStoreProvider,
  useWorkflows,
} from '~/providers';
import { getAuthSession } from '~/cookies/auth.server';
import { THEME } from './constants';
import { authAPIUrl, environment, orderAPIUrl, productAPIUrl } from './config/app.config.server';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: twStyles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
  ...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
];

export const meta: MetaFunction = () => [
  {
    title: 'ProjectX App',
  },
];

type LoaderData = {
  theme: string;
  user?: UserDto;
  csrfToken: string;
  accessToken?: string;
  isAuthenticated: boolean;
  ENV: ReturnType<typeof getEnv>;
};

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
  const [csrfToken, cookieHeader] = await csrf.commitToken();
  const theme = request.headers.get('Cookie')?.includes('theme=dark')
    ? THEME.DARK
    : THEME.LIGHT;
  const { getAuthUser, getAuthAccessToken } = await getAuthSession(request);
  const accessToken = getAuthAccessToken();
  const user = getAuthUser();
  return json<LoaderData>(
    {
      theme,
      csrfToken,
      ENV: {
        NODE_ENV: environment,
        AUTH_API_URL: authAPIUrl,
        ORDER_API_URL: orderAPIUrl,
        PRODUCT_API_URL: productAPIUrl,
      },
      isAuthenticated: !!accessToken,
      user,
      accessToken,
    },
    {
      headers: {
        'Set-Cookie': cookieHeader as string,
      },
    }
  );
};

export type AppProps = PropsWithChildren<
  Omit<LoaderData, 'isAuthenticated'>
>;
function App({ csrfToken, theme, user, accessToken, ENV }: AppProps) {
  // Connect Temporal workflows
  useWorkflows({ accessToken, email: user?.email });
  return (
    <AuthenticityTokenProvider token={csrfToken}>
      <html lang="en" data-theme={theme}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="color-scheme"
            content={theme === THEME.DARK ? 'dark light' : 'light dark'}
          />
          <Meta />
          <Links />
        </head>
        <body>
          <script
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: String.raw`
                  window.ENV = ${JSON.stringify(ENV)};
                `,
            }}
          />
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </AuthenticityTokenProvider>
  );
}

const AppWithProviders = withQueryClientProvider(withStoreProvider(
  withAuthProvider(withCartProvider(App))
));
/**
 * This is the root component of the app. It is used to wrap the app with the providers.
 */
export default function () {
  const { user, ...props } = useLoaderData<LoaderData>();
  return <AppWithProviders {...props} user={user as unknown as UserDto} />;
}

export const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <div>
      {isRouteErrorResponse(error) ? (
        <div>
          <h1>
            {error.status} {error.statusText}
          </h1>
          <p>{error.data}</p>
        </div>
      ) : error instanceof Error ? (
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      ) : (
        <h1>Unknown Error</h1>
      )}
    </div>
  );
};
