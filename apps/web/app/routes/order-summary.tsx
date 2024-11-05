import type { LoaderFunction, MetaFunction } from '@remix-run/node';

import OrderSummary from '~/pages/OrderSummary';
import { getAccessTokenOrRedirect } from '~/cookies/auth.server';
import PageLayout from '~/pages/PageLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'ProjectX - Order Summary' },
    { name: 'description', content: 'View your order summary.' },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await getAccessTokenOrRedirect(request);
};

export default function Index() {
  return (
    <PageLayout title="ProjectX">
      <OrderSummary />
    </PageLayout>
  );
}
