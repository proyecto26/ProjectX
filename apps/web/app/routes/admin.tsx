import type { LoaderFunction, MetaFunction } from '@remix-run/node';

import { getAccessTokenOrRedirect } from '~/cookies/auth.server';
import { AdminPage } from '~/pages/Admin';
import PageLayout from '~/pages/PageLayout';

export const meta: MetaFunction = () => {
  return [
    { title: 'ProjectX - Admin Dashboard' },
    {
      name: 'description',
      content:
        'Display the admin dashboard to manage your orders, notifications, and other settings.',
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await getAccessTokenOrRedirect(request);
  return null;
};

export default function Index() {
  return (
    <PageLayout title="Admin">
      <AdminPage />
    </PageLayout>
  );
}
