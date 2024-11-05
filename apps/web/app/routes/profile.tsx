import type { LoaderFunction, MetaFunction } from '@remix-run/node';

import { getAccessTokenOrRedirect } from '~/cookies/auth.server';
import PageLayout from '~/pages/PageLayout';
import { ProfilePage } from '~/pages/Profile';

export const meta: MetaFunction = () => {
  return [
    { title: 'ProjectX - Profile' },
    {
      name: 'description',
      content:
        'Display your profile information and manage your account settings.',
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await getAccessTokenOrRedirect(request);
  return null;
};

export default function Index() {
  return (
    <PageLayout title="Profile">
      <ProfilePage />
    </PageLayout>
  );
}
