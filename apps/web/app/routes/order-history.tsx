import type { LoaderFunction, MetaFunction } from '@remix-run/node';

import { OrderHistory } from '~/pages/OrderHistory';
import { getAccessTokenOrRedirect } from '~/cookies/auth.server';
import PageLayout from '~/pages/PageLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'ProjectX - Order History' },
    { name: 'description', content: 'View your order history.' },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await getAccessTokenOrRedirect(request);
  return {};
};

export default function Index() {
  return (
    <PageLayout title="ProjectX">
      <OrderHistory />
    </PageLayout>
  );
}
