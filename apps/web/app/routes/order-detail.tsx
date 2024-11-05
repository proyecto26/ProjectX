import type { LoaderFunction, MetaFunction } from '@remix-run/node';

import { getAccessTokenOrRedirect } from '~/cookies/auth.server';
import { OrderPage } from '~/pages/Order';
import PageLayout from '~/pages/PageLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'ProjectX - Order Detail' },
    {
      name: 'description',
      content:
        'View the details of your order and manage your order settings.',
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await getAccessTokenOrRedirect(request);
};

export default function Index() {
  return (
    <PageLayout title="ProjectX">
      <OrderPage />
    </PageLayout>
  );
}
