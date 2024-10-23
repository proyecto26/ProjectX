import type { MetaFunction, LinksFunction, LoaderFunction } from '@remix-run/node';
import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';

import twStyles from './tailwind.css';
import CartProvider from './providers/CartProvider';

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
];

export const meta: MetaFunction = () => [
  {
    title: 'New Remix App',
  },
];

export const loader: LoaderFunction = async ({ request }) => {
  const theme = request.headers.get('Cookie')?.includes('theme=dark')
    ? 'dark'
    : 'light';
  return json({ theme });
};

export default function App() {
  const { theme } = useLoaderData<{ theme: string }>();
  return (
    <CartProvider>
    <html lang="en" data-theme={theme}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
      </html>
    </CartProvider>
  );
}
